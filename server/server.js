const express = require("express");
const app = express();
const pg = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const port = 5500;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET;
const conString = process.env.DB_KEY;
const client = new pg.Client(conString);

client.connect(function (err) {
  if (err) {
    console.error("Could not connect to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  client.query(
    "SELECT * FROM tbl_user WHERE email = $1",
    [email],
    function (err, result) {
      if (err) {
        console.error("Error occurred during login:", err);
        res.status(500).send("Error occurred during login");
      } else {
        if (result.rows.length === 0) {
          res.status(409).send("User with this email does not exist");
        } else {
          const user = result.rows[0];
          bcrypt.compare(
            password,
            user.password,
            function (err, passwordMatch) {
              if (err) {
                console.error(
                  "Error occurred during password comparison:",
                  err
                );
                res.status(500).send("Error occurred during login");
              } else if (passwordMatch) {
                const payload = {
                  email: user.email,
                  name: user.name,
                  username: user.username,
                };
                const token = jwt.sign(payload, jwtSecret, {
                  expiresIn: "24h",
                });
                res.status(200).json({
                  token,
                  name: user.name,
                  username: user.username,
                  userid: user.userid,
                });
              } else {
                res.status(401).send("Incorrect password");
              }
            }
          );
        }
      }
    }
  );
});

app.post("/signup", function (req, res) {
  const { name, email, username, password } = req.body;
  client.query(
    "SELECT * FROM tbl_user WHERE username = $1 OR email = $2",
    [username, email],
    function (err, result) {
      if (err) {
        console.error("Error occurred during signup:", err);
        res.status(500).send("Error occurred during signup");
      } else {
        if (result.rows.length > 0) {
          res.status(409).send("User already exists");
        } else {
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.log("Error while hashing password: ", err);
              res.status(500).send("Error occurred during signup");
            } else {
              client.query(
                "INSERT INTO tbl_user (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING userid",
                [name, email, username, hashedPassword],
                function (err, result) {
                  if (err) {
                    console.error("Error occurred during signup:", err);
                    res.status(500).send("Error occurred during signup");
                  } else {
                    const user = {
                      userid: result.rows[0].userid,
                      email: email,
                      name: name,
                      username: username,
                    };
                    const payload = {
                      email: user.email,
                      name: user.name,
                      username: user.username,
                    };
                    const token = jwt.sign(payload, jwtSecret, {
                      expiresIn: "24h",
                    });
                    res.status(200).json({
                      token,
                      name: user.name,
                      username: user.username,
                      email: user.email,
                      userid: user.userid,
                    });
                  }
                }
              );
            }
          });
        }
      }
    }
  );
});

app.get("/getposts", function (req, res) {
  client.query(
    "SELECT tbl_posts.post, tbl_user.username, tbl_user.name, tbl_posts.likes, tbl_posts.postid, tbl_posts.userid as postuserid, tbl_posts.media_path FROM tbl_posts INNER JOIN tbl_user ON tbl_posts.userid = tbl_user.userid ORDER BY tbl_posts.created_at DESC",
    (err, result) => {
      if (err) {
        console.error("Error while fetching posts");
        res.status(500).send("Error while fetching posts");
      } else {
        res.status(200).send(result.rows);
      }
    }
  );
});

app.post("/like", function (req, res) {
  const { postid } = req.body;
  client.query(
    "UPDATE tbl_posts SET likes = likes + 1 WHERE postid = $1",
    [postid],
    function (err, result) {
      if (err) {
        console.error("Error occurred during liking a post:", err);
        res.status(500).send("Error occurred during liking a post");
      } else {
        if (result.rowCount === 0) {
          res.status(404).send("No post found with the provided post id.");
        } else {
          res.status(200).send("Likes incremented by 1");
        }
      }
    }
  );
});

app.post("/post", upload.single("media"), function (req, res) {
  console.log(req);
  const { userid, post } = req.body;
  const media = req.file;
  const mediaPath = media ? media.filename : null;
  client.query(
    "INSERT INTO tbl_posts (userid,post,media_path) VALUES ($1,$2,$3)",
    [userid, post, mediaPath],
    function (err, result) {
      if (err) {
        console.error("Error occurred during adding a post:", err);
        res.status(500).send("Error occurred during adding a post");
      } else {
        res.status(200).send("Post was added successfully");
      }
    }
  );
});

app.post("/delete", function (req, res) {
  const { postid } = req.body;
  client.query(
    "DELETE FROM tbl_posts WHERE postid = $1",
    [postid],
    function (err, result) {
      if (err) {
        console.error("Error occurred during deleting a post:", err);
        res.status(500).send("Error occured during deleting a post");
      } else {
        console.log("Post deleted successfully");
        res.status(200).send("Post was deleted successfully");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
