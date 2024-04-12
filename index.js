require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AccountModel = require("./dbmodel");
const reviewModel = require("./model/review");
const Jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_KEY;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  process.env.MONGODB_URI
);

app.post("/register", (req, res) => {
  AccountModel.create(req.body)
    .then((Accounts) => {
      Jwt.sign({ user: Accounts }, jwtKey, (err, token) => {
        if (err) {
          res.json("Error creating JWT token");
        } else {
          res.json({ user: Accounts, auth: token });
        }
      });
    })
    .catch((err) => res.json(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  AccountModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          // If password matches, sign JWT token and send user details with token
          Jwt.sign({ user }, jwtKey, (err, token) => {
            if (err) {
              res.status(500).json({ error: "Error signing JWT token" });
            } else {
              res.json({ message: "Success", user, auth: token });
            }
          });
          // res.json("Success")
        } else {
          res.status(401).json({ error: "The password is incorrect" });
        }
      } else {
        res
          .status(404)
          .json({ error: "No record found for the provided email" });
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ error: "An unexpected error occurred" });
    });
});

app.post("/reviews", (req, res) => {
  reviewModel
    .create(req.body)
    .then((reviews) => res.json(reviews))
    .catch((err) => res.json(err));
});

app.get("/getreviews", async (req, res) => {
  try {
    let reviews = await reviewModel.find();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getreviews/:id", async (req, res) => {
  let movieId = req.params.id;
  // res.json(movieId)
  try {
    let reviews = await reviewModel.find({ movieId: movieId });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Listening at port 3001");
});
