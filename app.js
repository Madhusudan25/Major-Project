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
const Hospital = models.Hospital;
const Patient = models.Patient;

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/doctor", (req, res) => {
  res.render("doctor");
});

app.get("/patient",(req,res)=>{
  res.render("patient");
})

app.get("/error", (req, res) => {
  res.render("error");
});

app.post("/admin/verify", (req, res) => {
  console.log(req.body.address);
  Hospital.findOne(
    { hospitalPublicAddress: req.body.address },
    (err, foundHospital) => {
      if (!err) {
        console.log("No error");
        if (foundHospital) {
          console.log("FoundUser");
          res.status(200).json({ hospitalData: foundHospital.doctorsList });
        } else {
          console.log("NotFoundUser");
          res.status(409).json({ data: "You are not identified as Admin" });
        }
      }
    }
  );
});

app.post("/admin/addDoctor", (req, res) => {
  console.log("Address of hospital is :");
  console.log(req.body.doctorName);
  console.log(req.body.hospitalPublicAddress);
  console.log(req.body.publicAddress);
  Doctor.findOne(
    { publicAddress: req.body.publicAddress.toLowerCase() },
    function(err, foundDoctor){
      console.log(foundDoctor);
      if (!err) {
        if (!foundDoctor) {
          console.log("Doctor not present in DB");
          const newDoctor = new Doctor({
            doctorName: req.body.doctorName,
            publicAddress: req.body.publicAddress.toLowerCase(),
          });
          newDoctor.save(function (err, result) {
            if (err) {
              console.log(err);
            }
          });

          Hospital.findOne(
            { hospitalPublicAddress: req.body.hospitalPublicAddress },
            (errHospital,foundHospital)=>{
              if(!errHospital){
                foundHospital.doctorsList.push(newDoctor);
                foundHospital.save();
                res.status(200);
              }
              else {
                res.status(500).send("Database error");
              }
            }
          );
        }
        else{
          console.log("Doctor already added");
          res.status(409).json({msg:"Doctor is already present!! Cannot add!"});
          
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
        res.status(409).send("You are not identified as doctor");
      }
      res.status(200).json({ doctorData: foundDoctor });
    }
  });
});

app.post("/patient/verify", (req, res) => {
  console.log(req.body.patientName);
  console.log(req.body.phoneNo);
  console.log(req.body.age);
  
  // Successsssssss
  Hospital.find({},(err,foundHospital)=>{
    if(!err){
      if(foundHospital){
        res.status(200).json({hospitalInfo:foundHospital});
      }
      else{
        res.status(409).json({errorMsg:"No hospital found"});
      }
    }
  })

  // Doctor.findOne({ publicAddress: req.body.address }, (err, foundDoctor) => {
  //   if (!err) {
  //     if (!foundDoctor) {
  //       res.status(409).send("You are not identified as doctor");
  //     }
  //     res.status(200).json({ doctorData: foundDoctor });
  //   }
  // });
});

app.listen(3000, (req, res) => {
  console.log("Server is started at port 3000");
});
