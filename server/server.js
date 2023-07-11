const pg = require("pg");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();
const port = 5500;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const conString =
  "postgres://yuojwpar:ILr6DxAHLFTSdYTUxNqNtxCo0sTvhwSW@tyke.db.elephantsql.com/yuojwpar";
const client = new pg.Client(conString);

client.connect(function (err) {
  if (err) {
    console.error("Could not connect to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

app.use(cors());
app.use(express.json());

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
                "INSERT INTO tbl_user (name, email, username, password) VALUES ($1, $2, $3, $4)",
                [name, email, username, hashedPassword],
                function (err, result) {
                  if (err) {
                    console.error("Error occurred during signup:", err);
                    res.status(500).send("Error occurred during signup");
                  } else {
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

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
