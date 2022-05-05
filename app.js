const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models/model.js");
const { json } = require("express/lib/response");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/build/contracts"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/MP", {
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
  Hospital.find({},(err,foundHospitals)=>{
    if(!err){
      if(foundHospitals){
        res.render("patientRegister",{hospitalInfo:foundHospitals});
      }
    }
  }
)})

app.get("/patient/login",(req,res)=>{
  res.render("patientLogin");
})

app.get("/error", (req, res) => {
  res.render("error");
});

app.post("/admin/verify", (req, res) => {
  Hospital.findOne(
    { hospitalPublicAddress: req.body.address },
    (err, foundHospital) => {
      if (!err) {
        if (foundHospital) {
          res.status(200).json({ hospitalData: foundHospital.doctorsList });
        } 
        else {
          res.status(409).json({ data: "You are not identified as Admin" });
        }
      }
    }
  );
});

app.post("/admin/addDoctor", (req, res) => {
  console.log(req.body.doctorName);
  console.log("Address of hospital is :");
  console.log(req.body.hospitalPublicAddress);
  console.log(req.body.publicAddress);
  Hospital.findOne({hospitalPublicAddress:req.body.hospitalPublicAddress},(errHospital,foundHospital)=>{
    if(!errHospital){
      if(foundHospital){
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
                foundHospital.doctorsList.push(newDoctor);
                foundHospital.save();
                res.status(200).json({success:"Successfully added doctor"});
              }
              else{
                res.status(409).json({msg:"Doctor address already exists!!Cannot add"})
              }
            }
          }
        );
      }
      else{
        res.status(409).json({msg:"You have no access to this page..Cannot add doctor!!"});
      }
    }
  })
});

app.post("/doctor/verify", (req, res) => {
  console.log(req.body.address);
  Doctor.findOne({ publicAddress: req.body.address }, (err, foundDoctor) => {
    if (!err) {
      if (!foundDoctor) {
        res.status(409).json("You are not identified as doctor");
      }
      else{
        res.status(200).json({ doctorData: foundDoctor.patientsList });
      }
    }
  });
});

app.post("/patient/register", (req, res)=> {
  Patient.findOne({patientPublicAddress:req.body.address},async function(err,foundPatient){
    if(!err){
      if(foundPatient){
        res.status(409).json({"Message":"Already registered..!Please login"});
      }
      else{
        const newPatient=new Patient({
          patientName: req.body.patientName,
          patientPhoneNo:req.body.phoneNo,
          patientAge:req.body.age,
          patientPassword:req.body.password,
          patientPublicAddress:req.body.address,
          hospitalId:req.body.hospitalId,
          doctorId:req.body.doctorId
        })
        console.log(newPatient);
        let patientInfo;
        await newPatient.save((err,savedPatient)=>{
          console.log(savedPatient);
          patientInfo=savedPatient._id;
          // res.status(200).json({"id":savedPatient._id});
        });
        Doctor.findOne({_id:newPatient.doctorId},(err,foundDoctor)=>{
          if(!err){
            if(foundDoctor){
              foundDoctor.patientsList.push(newPatient);
              foundDoctor.save();
              res.status(200).json({"id":patientInfo});
            }
            else{
              res.status(409).json({"Message":"Doctor not found"});
            }
          }
        })
      }
    }
  })
});

app.post("/patient/login", (req, res)=> {
  Patient.findOne({patientPublicAddress:req.body.address},(err,foundPatient)=>{
    console.log(foundPatient);
    console.log(req.body);
    if(!err){
      if(foundPatient){
        if(foundPatient.patientPassword !== req.body.password){
          res.status(409).json({"errorMsg":"Invalid password or Metamask account mismatch"});
        }
        else{
          res.status(200).json({"id":foundPatient._id});
        }
      }
      else{
        res.status(409).json({"errorMsg":"User Account not found..Please Register!!"});
      }
    }
  })
});

app.listen(3000, (req, res) => {
  console.log("Server is started at port 3000");
});
