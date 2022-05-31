const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const models = require("./models/model.js");
const md5 = require("md5");

const {spawn} =require('child_process');

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
const PatientDiabetesData = models.PatientDiabetesData;
const PatientHeartData = models.PatientHeartData;

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

// Handling Machine learning 

app.get("/patient/:id",(req,res)=>{
  res.render("patientAfterLogin")
})

app.post("/patient/:id/diabtetesTest",async (req,res)=>{
  var id=req.params.id;
  console.log("Mongo Id is : " + id);
  console.log("Data received is : "+ req.body.data)

  var age=generateRandomNumber();
  var pregnancies=generateRandomNumber(0,17);
  var glucose=generateRandomNumber(0,199);
  var bloodPressure=generateRandomNumber(0,122);
  var skinThickness=generateRandomNumber(0,99);
  var insulin=generateRandomNumber(0,846);
  var BMI=generateRandomNumber(0,68);
  var pedigreeFunction=parseFloat(generateRandomNumber(0,3));
  var diabetesResult=-999;
  
  const  diabetes_model= spawn('python',['Python_files/diabetes_prediction.py',[pregnancies,glucose,bloodPressure,skinThickness,insulin,BMI,pedigreeFunction,age]]);

  diabetes_model.stdout.on('data',(data)=>{
      // Cannot use console.log(data)-->It gives buffer value;
      console.log(`${data}`);
      diabetesResult=Math.round(parseFloat(data))
      Patient.findOne({_id:id},(err,foundPatient)=>{
        if(!err){
          if(!foundPatient){
            res.status(404).json({"message":"Patient is not found"});
          }
          else
          {
            const data=new PatientDiabetesData({
              testAge : age,
              testPregnancies : pregnancies,
              testGlucose : glucose,
              testBloodPressure : bloodPressure,
              testSkinThickness : skinThickness,
              testInsulin : insulin,
              testBMI : BMI,
              testPedigreeFunction : pedigreeFunction,
              testDiabetesResult : diabetesResult
            })
            foundPatient.testDiabetesData.push(data);
            foundPatient.save((error,savedPatient)=>{
              console.log(savedPatient);
              if(!error){
                if(savedPatient)
                {var dataTestedArray=savedPatient.testDiabetesData;
                  var lastTestedData=dataTestedArray[dataTestedArray.length-1];
                  var lastTestedDataMongoId=lastTestedData._id;
        
                  var lastTestedDataHash=md5(lastTestedData);
        
                  console.log(lastTestedData);
                  console.log(lastTestedDataMongoId);
                  console.log(lastTestedDataHash);
                  res.status(200).json({"id":lastTestedDataMongoId,"hash":lastTestedDataHash});}
              }
              else{
                res.status(404).json({"msg":"couldnot save patientinfo"});
              }
              
              
    
            });
          }
          
        }
      })

      // res.send("The predicted output of diabetes prediction is: "+ Math.round(parseFloat(data)))
  })

  diabetes_model.stderr.on('data',(data)=>{
      console.log("Error is :",`${data}`);
  })

  
})


function generateRandomNumber(low=0,high=100){
  return parseFloat(Math.floor(low + (Math.random() * high) + 1));

}

app.post("/patient/:id/heartDiseaseTest",async (req,res)=>{
  var id=req.params.id;
  console.log("Mongo Id is : " + id);
  console.log("Data received is : "+ req.body.data)

    var age=generateRandomNumber();
    var sex=generateRandomNumber(0,1);
    var cp=generateRandomNumber(0,3);
    var trestbps=generateRandomNumber(94,200);
    var chol=generateRandomNumber(126,564);
    var fbs=generateRandomNumber(0,1)
    var restecg=generateRandomNumber(0,2)
    var thalach=generateRandomNumber(71,202)
    var exang=generateRandomNumber(0,1)
    var oldpeak=generateRandomNumber(0,6.2)
    var slope=generateRandomNumber(0,2)
    var ca=generateRandomNumber(0,4)
    var thal=generateRandomNumber(0,3)
    var value;

    const  heart_model=spawn('python',['Python_files/heart_prediction.py',[age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal]]);

    heart_model.stdout.on('data',(data)=>{
        console.log(`${data}`);
        value=`${data}`;
        Patient.findOne({_id:id},(err,foundPatient)=>{
          if(!err){
            if(!foundPatient){
              res.status(404).json({"message":"Patient is not found"});
            }
            else
            {
              const data=new PatientHeartData({
                age:age,
                sex : sex,
                cp: cp,
                trestbps: trestbps,
                chol: chol,
                fbs: fbs,
                restecg:restecg ,
                thalach:thalach ,
                exang: exang,
                oldpeak: oldpeak,
                slope: slope,
                ca: ca,
                thal: thal,
                testHeartResult : value
              })
      
              foundPatient.testHeartData.push(data);
              foundPatient.save((error,savedPatient)=>{
                console.log(savedPatient);
                if(!error){
                  if(savedPatient)
                  {var dataTestedArray=savedPatient.testHeartData;
                    var lastTestedData=dataTestedArray[dataTestedArray.length-1];
                    var lastTestedDataMongoId=lastTestedData._id;
          
                    var lastTestedDataHash=md5(lastTestedData);
          
                    console.log(lastTestedData);
                    console.log(lastTestedDataMongoId);
                    console.log(lastTestedDataHash);
                    res.status(200).json({"id":lastTestedDataMongoId,"hash":lastTestedDataHash});}
                }
                else{
                  res.status(404).json({"msg":"could not save patientinfo"});
                }
              });
            } 
          }
        })
    })

  
})

app.delete("/patient/:id/deteleLastDiabetesData",(req,res)=>{
  const id=req.params.id;
  console.log(req.body.data);
  Patient.findOne({_id:id},(err,foundPatient)=>{
    foundPatient.testDiabetesData.pop();
    foundPatient.save();
  })
})

app.post("/patient/:id/compareBCandMongoDiabetesData",(req,res)=>{
  const bcResult=req.body.result;
  Patient.findOne({_id:req.params.id},(err,found)=>{
    found.testDiabetesData.forEach(function(data,i) {
      if(data._id.toString()!==bcResult[i][0] || md5(data)!==bcResult[i][1]){
        res.status(400).json({"msg":"Data integrity compromised!!"})
      }
    });
    res.status(200).json({data:found.testDiabetesData})
  })
})
app.listen(3000, (req, res) => {
  console.log("Server is started at port 3000");
});
