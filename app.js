const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models/model.js");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/doctorDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Doctor = models.Doctor;

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/doctor", (req, res) => {
  res.render("doctor");
});

app.post("/admin", (req, res) => {
  console.log(req.body.doctorname);
  Doctor.findOne(
    { publicAddress: req.body.public_address },
    (err, foundDoctor) => {
      if (!err) {
        if (!foundDoctor) {
          const newDoctor = new Doctor({
            username: req.body.doctorname,
            publicAddress: req.body.public_address,
          });
          newDoctor.save(function (err, result) {
            if (err) {
              console.log(err);
            }
          });
          console.log("Hello");
        }
      }
    }
  );
});

app.post("/doctor/verify", (req, res) => {
  console.log(req.body.address);
  Doctor.findOne({ publicAddress: req.body.address }, (err, foundDoctor) => {
    if (!err) {
      if (!foundDoctor) {
        console.log;
        res.status(409).send("You are not identified as doctor");
      }
      res.status(200).json({ doctorData: foundDoctor });
    }
  });
});

app.listen(3000, (req, res) => {
  console.log("Server is started at port 3000");
});
