const pg = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 5500;

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

app.get("/login", function (req, res) {
  res.send({ token: "123ik" });
});

app.post("/signup", function (req, res) {
  const { name, email, username, password } = req.body;
  client.query(
    "INSERT INTO tbl_user (name, email, username, password) VALUES ($1, $2, $3, $4)",
    [name, email, username, password],
    function (err, result) {
      if (err) {
        console.error("Error occurred during signup:", err);
        res.status(500).send("Error occurred during signup");
      } else {
        console.log("User registered successfully");
        res.status(200).send("User registered successfully");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
