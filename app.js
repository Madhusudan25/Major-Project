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
const Technician= models.Technician;

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});

app.get("/doctor", (req, res) => {
  res.render("doctor");
});

app.get("/technician/register",(req,res)=>{
  res.render("technicianRegister");
})

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

app.get("/technician/login",(req,res)=>{
  res.render("technicianLogin")
})

app.get("/technician/:id",(req,res)=>{
  var id=req.params.id;
  Technician.findOne({_id:id},(err,foundTech)=>{
    if(!err){
      if(foundTech){
        var username=foundTech.techName.split("@")[0];
        Patient.find({},{patientName: 1,patientPhoneNo:1,patientAge:1,patientSex:1,testDiabetesData:1,testHeartData:1},(err,foundPatient)=>{
          var allTestedDiabetes=[];
          var allTestedHeart=[];
          foundPatient.forEach(data => {
            if(data.testDiabetesData.length===0 || data.testDiabetesData[data.testDiabetesData.length-1].testDiabetesResult!==null){
              allTestedDiabetes.push(true);
            }
            else{
              allTestedDiabetes.push(false);
            }
            if(data.testHeartData.length===0 || data.testHeartData[data.testHeartData.length-1].testHeartResult!==null){
              allTestedHeart.push(true);
            }
            else{
              allTestedHeart.push(false);
            }
          });
          res.render("technician",{username:username , data:foundPatient,isTestedDiabetes:allTestedDiabetes,isTestedHeart:allTestedHeart})
        })
      }
      else{
        res.redirect("/error");
      }
    }
    else{
      res.redirect("/error");
    }
  })
})
 
app.get("/patient/:id",(req,res)=>{
  var allowSharing=false;

  Patient.findOne({_id:req.params.id},(err,foundPatient)=>{
    if(err){
      res.redirect("/error");
    }
    else{
      if(foundPatient){
        allowSharing=foundPatient.allowSharing;
        if(foundPatient.hospitalId==="" && foundPatient.doctorId === ""){
          Hospital.find({},(err,foundHospitals)=>{
            if(!err){
              if(foundHospitals){
                // res.render("patientRegister",{hospitalInfo:foundHospitals});
                res.render("patientAfterLogin",{hospitalInfo:foundHospitals,sharingState:allowSharing,patientData:foundPatient.patientName,diabetesData:foundPatient.testDiabetesData,heartData:foundPatient.testHeartData})
              }
            }
          })
        }
        else{
          res.render("patientAfterLogin",{hospitalInfo:"",sharingState:allowSharing,patientData:foundPatient.patientName,diabetesData:foundPatient.testDiabetesData,heartData:foundPatient.testHeartData})
        }
      }
    }
  })
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
  // console.log(req.body.doctorName);
  // console.log("Address of hospital is :");
  // console.log(req.body.hospitalPublicAddress);
  // console.log(req.body.publicAddress);
  Hospital.findOne({hospitalPublicAddress:req.body.hospitalPublicAddress},(errHospital,foundHospital)=>{
    if(!errHospital){
      if(foundHospital){
        Doctor.findOne(
          { publicAddress: req.body.publicAddress.toLowerCase() },
          function(err, foundDoctor){
            if (!err) {
              if (!foundDoctor) {
                // console.log("Doctor not present in DB");
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
                res.status(200).json({success:"Successfully added doctor",data:foundHospital.doctorsList});
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
  Doctor.findOne({ publicAddress: req.body.address }, (err, foundDoctor) => {
    if (!err) {
      if (!foundDoctor) {
        res.status(409).json({"msg":"You are not identified as doctor"});
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
          patientSex:req.body.sex,
          patientPassword:req.body.password,
          patientPublicAddress:req.body.address,
          hospitalId:req.body.hospitalId,
          doctorId:req.body.doctorId,
          // hospitalId:"",
          // doctorId:"",
          allowSharing:false
        })
        await newPatient.save((err,savedPatient)=>{
          Doctor.findOne({_id:newPatient.doctorId},(err,foundDoctor)=>{
            if(!err){
              if(foundDoctor){
                foundDoctor.patientsList.push(newPatient);
                foundDoctor.save();
                res.status(200).json({"id":savedPatient._id});
              }
              else{
                res.status(409).json({"Message":"Doctor not found"});
              }
            }
          })
        });
      }
    }
  })
});

app.post("/patient/login", (req, res)=> {
  Patient.findOne({patientPublicAddress:req.body.address},(err,foundPatient)=>{
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

app.post("/technician/register",(req,res)=>{
  var technicianName=req.body.username;
  var technicianPasswd=req.body.password;
  Technician.findOne({techName:technicianName},(err,foundTech)=>{
    if(!err){
      if(foundTech){
        res.status(404).json({"msg":"User name alreasy exists!Please login"})
      }
      else{
        const newTech= new Technician({
          techName:technicianName,
          techPassword:technicianPasswd
        })

        newTech.save(function (error, result) {
          if (!error) {
            res.status(200).json({"data":result._id})
          }
        });
      }
    }
  })
})

app.post("/technician/login",(req,res)=>{
  var technicianName=req.body.username;
  var technicianPasswd=req.body.password;
  Technician.findOne({techName:technicianName},(err,foundTech)=>{
    if(!err){
      if(!foundTech){
        res.status(404).json({"msg":"Username doesnot exist!"})
      }
      else{
        if(foundTech.techPassword===technicianPasswd){
          res.status(200).json({"data":foundTech._id})
        }
        else{
          res.status(400).json({"msg":"Password mismatch!Please retry!!"})
        }
      }
    }
  })
})


app.post("/patient/:id/diabetesTest",async (req,res)=>{
  var id=req.params.id;
  var mongoId=req.body.mongoId;
  console.log("Mongo Patient Id is >>> " + id);
  console.log("Public address of patient received is >>> "+ req.body.data)
  var data;

  let dataRequired={
    "age":-999,
    "pregnancies":-999,
    "glucose":-999,
    "bloodPressure":-999,
    "skinThickness":-999,
    "insulin":-999,
    "BMI":-999,
    "pedigreeFunction":-999,
    "time":""
  }

  Patient.findOne({_id:id}, async (err,foundPatient)=>{
    data = foundPatient.testDiabetesData.filter(x=>x._id==mongoId)[0];
    dataRequired.age= data.testAge;
    dataRequired.pregnancies=data.testPregnancies;
    dataRequired.glucose=data.testGlucose;
    dataRequired.bloodPressure=data.testBloodPressure;
    dataRequired.skinThickness=data.testSkinThickness;
    dataRequired.insulin=data.testInsulin;
    dataRequired.BMI=data.testBMI;
    dataRequired.pedigreeFunction=data.testPedigreeFunction;
    dataRequired.time= getCurrentDateTime();
    await callDiabetesMLModel(dataRequired,id,mongoId,res);
  })
})

function callDiabetesMLModel(dataRequired,patientId,mongoId,res){
  const  diabetes_model= spawn('python',['Python_files/diabetes_prediction.py',[dataRequired.pregnancies,dataRequired.glucose,dataRequired.bloodPressure,dataRequired.skinThickness,dataRequired.insulin,dataRequired.BMI,dataRequired.pedigreeFunction,dataRequired.age]]);
  diabetes_model.stdout.on('data',(data)=>{
    console.log(`The result obtained from ML model for diabetes test is >>> ${data}`);
    diabetesResult=Math.round(parseFloat(data))
    Patient.update({'testDiabetesData._id': mongoId},
    {'$set': {
      'testDiabetesData.$.testTimings':dataRequired.time,
      'testDiabetesData.$.testDiabetesResult': diabetesResult
    }},
    function(err,model) {
      if(!err){
          console.log(model);
          Patient.findOne({_id:patientId},(err,foundPatient)=>{
            var dataTestedArray=foundPatient.testDiabetesData;
            var lastTestedData=dataTestedArray[dataTestedArray.length-1];
            var lastTestedDataMongoId=lastTestedData._id;

            var lastTestedDataHash=md5(lastTestedData);

            console.log("The MongoDB Id of the last tested data  >>>> " + lastTestedDataMongoId);
            console.log("The hash of the last tested data object >>>> " + lastTestedDataHash);

            res.status(200).json({"id":lastTestedDataMongoId,"hash":lastTestedDataHash});
          })
      }
    });
  })
}

app.post("/patient/:id/heartDiseaseTest",async (req,res)=>{
  var id=req.params.id;
  var mongoId=req.body.mongoId;
  console.log("Data received is : "+ req.body.data)
  var data;

  var dataRequired={
    "age":-999,
    "sex":-999,
    "cp":-999,
    "trestbps":-999,
    "chol":-999,
    "fbs":-999,
    "restecg":-999,
    "thalach":-999,
    "exang":-999,
    "oldpeak":-999,
    "slope":-999,
    "ca":-999,
    "thal":-999,
    "time":""
  }
  Patient.findOne({_id:id}, async (err,foundPatient)=>{
    dataRequired.age=foundPatient.patientAge;
    
    dataRequired.sex=foundPatient.patientSex==="Male"?0:1;
    data = foundPatient.testHeartData.filter(x=>x._id==mongoId)[0];
    // console.log(data);
    dataRequired.cp=data.cp;
    dataRequired.trestbps=data.trestbps;
    dataRequired.chol=data.chol;
    dataRequired.fbs=data.fbs;
    dataRequired.restecg=data.restecg;
    dataRequired.thalach=data.thalach;
    dataRequired.exang=data.exang;
    dataRequired.oldpeak=data.oldpeak;
    dataRequired.slope=data.slope;
    dataRequired.ca=data.ca;
    dataRequired.thal=data.thal;
    dataRequired.time= getCurrentDateTime();
    await callHeartMLModel(dataRequired,id,mongoId,res);
  })
  
  function callHeartMLModel(dataRequired,patientId,mongoId,res){
    console.log(dataRequired);
    const  heart_model=spawn('python',['Python_files/heart_prediction.py',[dataRequired.age,dataRequired.sex,dataRequired.cp,dataRequired.trestbps,dataRequired.chol,dataRequired.fbs,dataRequired.restecg,dataRequired.thalach,dataRequired.exang,dataRequired.oldpeak,dataRequired.slope,dataRequired.ca,dataRequired.thal]]);
    heart_model.stdout.on('data',(data)=>{
      
      console.log(`The result obtained from ML model for heart test is >>> ${data}`);
      heartResult=`${data}`;
      Patient.update({'testHeartData._id': mongoId},
      {'$set': {
        'testHeartData.$.testTimings':dataRequired.time,
        'testHeartData.$.testHeartResult': heartResult
      }},
      function(err,model) {
        if(!err){
            console.log(model);
            Patient.findOne({_id:patientId},(err,foundPatient)=>{
              var dataTestedArray=foundPatient.testHeartData;
              var lastTestedData=dataTestedArray[dataTestedArray.length-1];
              var lastTestedDataMongoId=lastTestedData._id;
  
              var lastTestedDataHash=md5(lastTestedData);
  
              console.log("The MongoDB Id of the last tested data  >>>> " + lastTestedDataMongoId);
              console.log("The hash of the last tested data object >>>> " + lastTestedDataHash);
  
              res.status(200).json({"id":lastTestedDataMongoId,"hash":lastTestedDataHash});
            })
        }
      });
    })
    
  }
    // var value;

    // const  heart_model=spawn('python',['Python_files/heart_prediction.py',[age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal]]);

    // heart_model.stdout.on('data',(data)=>{
    //   console.log(`The result obtained from ML model for Heart test is >>> ${data}`);
    //     value=`${data}`;
    //     Patient.findOne({_id:id},(err,foundPatient)=>{
    //       if(!err){
    //         if(!foundPatient){
    //           res.status(404).json({"message":"Patient is not found"});
    //         }
    //         else
    //         {
    //           let time= getCurrentDateTime();
    //           const data=new PatientHeartData({
    //             testTimings:time,
    //             age:age,
    //             sex : sex,
    //             cp: cp,
    //             trestbps: trestbps,
    //             chol: chol,
    //             fbs: fbs,
    //             restecg:restecg ,
    //             thalach:thalach ,
    //             exang: exang,
    //             oldpeak: oldpeak,
    //             slope: slope,
    //             ca: ca,
    //             thal: thal,
    //             testHeartResult : value
    //           })
      
    //           foundPatient.testHeartData.push(data);
    //           foundPatient.save((error,savedPatient)=>{
    //             // console.log(savedPatient);
    //             if(!error){
    //               if(savedPatient)
    //               {var dataTestedArray=savedPatient.testHeartData;
    //                 var lastTestedData=dataTestedArray[dataTestedArray.length-1];
    //                 var lastTestedDataMongoId=lastTestedData._id;
          
    //                 var lastTestedDataHash=md5(lastTestedData);
          
    //                 console.log("The MongoDB Id of the last tested data  >>>> " + lastTestedDataMongoId);
    //                 console.log("The hash of the last tested data object >>>> " + lastTestedDataHash);

    //                 res.status(200).json({"id":lastTestedDataMongoId,"hash":lastTestedDataHash});}
    //             }
    //             else{
    //               res.status(404).json({"msg":"could not save patientinfo"});
    //             }
    //           });
    //         } 
    //       }
    //     })
    // }) 
})

app.delete("/patient/:id/deteleLastDiabetesData",(req,res)=>{
  const id=req.params.id;
  const mongoId=req.body.mongoId;
  Patient.update({'_id':id,'testDiabetesData._id': mongoId},
  {'$set': {
    'testDiabetesData.$.testTimings':"",
    'testDiabetesData.$.testDiabetesResult': null
  }},
  function(err,model) {
    if(!err){
      res.status(200).json({"data":"/patient/"+id})
    }
  })

})

app.delete("/patient/:id/deteleLastHeartData",(req,res)=>{
  const id=req.params.id;
  const mongoId=req.body.mongoId;
  Patient.update({'_id':id,'testHeartData._id': mongoId},
  {'$set': {
    'testHeartData.$.testTimings':"",
    'testHeartData.$.testHeartResult': null
  }},
  function(err,model) {
    if(!err){
      res.status(200).json({"data":"/patient/"+id})
    }
  })
})

app.post("/patient/:id/compareBCandMongoDiabetesData",(req,res)=>{
  const bcResult=req.body.result;
  console.log("Blockchain length : " + bcResult.length);
  Patient.findOne({_id:req.params.id},(err,found)=>{
    var msg="";
    found.testDiabetesData.forEach(function(data,i) {
      if(i<bcResult.length && (data._id.toString()!==bcResult[i][0] || md5(data)!==bcResult[i][1])){
        msg="Data integrity compromised!!";
      }
    });
    if(msg===""){
      res.status(200).json({data:found.testDiabetesData.slice(0,bcResult.length)})
    }
    else{
      res.status(400).json({"msg":msg})
    }
  })
})

app.post("/patient/:id/compareBCandMongoHeartData",(req,res)=>{
  const bcResult=req.body.result;
  Patient.findOne({_id:req.params.id},(err,found)=>{
    var msg="";
    found.testHeartData.forEach(function(data,i) {
      if(i<bcResult.length && (data._id.toString()!==bcResult[i][0] || md5(data)!==bcResult[i][1])){
        msg="Data integrity compromised!!"
      }
    });
    if(msg===""){
      res.status(200).json({data:found.testHeartData.slice(0,bcResult.length)})
    }
    else{
      res.status(400).json({"msg":msg})
    }
  })
})

app.post("/doctor/compareBCandMongoDiabetesData/doctorDisplay",(req,res)=>{
  const bcResult=req.body.result;
  Patient.findOne({patientPublicAddress:req.body.patientPublicAddress},(err,found)=>{
    if(found.allowSharing){
      var msg="";
      found.testDiabetesData.forEach(function(data,i) {
        if(i<bcResult.length && (data._id.toString()!==bcResult[i][0] || md5(data)!==bcResult[i][1])){
          msg="Data integrity compromised!!"
        }
      });
      if(msg===""){
        res.status(200).json({data:found.testDiabetesData.slice(0,bcResult.length)})
      }
      else{
        res.status(400).json({"msg":msg})
      }
    }
    else{
      res.status(400).json({"msg":"You have no access to this Patient's Diabetes data"});
    }
  })
})

app.post("/doctor/compareBCandMongoHeartData/doctorDisplay",(req,res)=>{
  const bcResult=req.body.result;
  Patient.findOne({patientPublicAddress:req.body.patientPublicAddress},(err,found)=>{
    if(found.allowSharing){
      var msg="";
      found.testHeartData.forEach(function(data,i) {
        if(i<bcResult.length && (data._id.toString()!==bcResult[i][0] || md5(data)!==bcResult[i][1])){
          msg="Data integrity compromised!!";
        }
      });
      if(msg===""){
        res.status(200).json({data:found.testHeartData.slice(0,bcResult.length)})
      }
      else{
        res.status(400).json({"msg":msg})
      }
    }
    else{
      res.status(400).json({"msg":"You have no access to this Patient's Heart data"});
    }
  })
})

app.patch("/patient/:id/toggleSharing",(req,res)=>{
  var doctorId;
  var patientId=req.params.id;

  Patient.findOne({_id:patientId},(err,foundPatient)=>{
    doctorId=foundPatient.doctorId;
    foundPatient.allowSharing=!foundPatient.allowSharing;
    foundPatient.save();
    Doctor.findOne({_id:doctorId},(docErr,foundDoctor)=>{
      item=foundDoctor.patientsList.id(patientId);
      item.allowSharing=!item.allowSharing;
      foundDoctor.save();
    })
    res.status(200).json({data:foundPatient.allowSharing})
  })
})

app.post("/doctor/viewPatientRecords",(req,res)=>{
  var patientId=req.body.id;
  Patient.findOne({_id:patientId},(err,foundPatient)=>{
    if(err){
      res.redirect("/error");
    }
    else{
      if(foundPatient){
        allowSharing=foundPatient.allowSharing;
        console.log(allowSharing)
        if(allowSharing){
          res.status(200).json({patientDiabetesDetails:foundPatient});
        }
        else{
          res.status(409).json({"msg":"You dont have access to patient details"})
        }
      }
    }
  })
})

app.post("/technician/diabetes",(req,res)=>{
  var patientId=req.body.patientId;
  var data=req.body.diabetesData;

  Patient.findOne({_id:patientId},(err,foundPatient)=>{
    if(!err){
      if(foundPatient){
        const diabetesData=new PatientDiabetesData(data);
        foundPatient.testDiabetesData.push(diabetesData);
        foundPatient.save((error,saved)=>{
          if(!error){
            res.status(200).json({"data":"Data saved successfully"})
          }
        })
      }
      else{
        res.status(500).json({"msg":"Something went wrong!!!"})
      }
    }else{
      res.status(500).json({"msg":"Something went wrong!!!"})
    }
  })
})

app.post("/technician/heart",(req,res)=>{
  var patientId=req.body.patientId;
  var data=req.body.heartData;

  console.log(data);
  Patient.findOne({_id:patientId},(err,foundPatient)=>{
    if(!err){
      if(foundPatient){
        const heartData=new PatientHeartData(data);
        foundPatient.testHeartData.push(heartData);
        foundPatient.save((error,saved)=>{
          if(!error){
            res.status(200).json({"data":"Data saved successfully"})
          }
        })
      }
      else{
        res.status(500).json({"msg":"Something went wrong!!!"})
      }
    }else{
      res.status(500).json({"msg":"Something went wrong!!!"})
    }
  })
})

function getCurrentDateTime(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = ("0" + date_ob.getHours()).slice(-2);
  let minutes =  ("0" + date_ob.getMinutes()).slice(-2);
  return (date + "-" + month + "-" + year + " " + hours + ":" + minutes);
}

app.listen(3000, (req, res) => {
  console.log("Server is started at port 3000");
});
