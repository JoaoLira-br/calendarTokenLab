const express = require("express");

const dotenv = require("dotenv");

const mysql = require("mysql");

dotenv.config({ path: "/.env" });

const app = express();

// NOTE: creating connection with mysql using .env variables, for the purpose of security of private information
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

app.listen(7720, () => {
  console.log("Server has started on Port 7720");
});
