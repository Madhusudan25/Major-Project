const mongoose = require("mongoose");

const patientDiabetesDataSchema=new mongoose.Schema({
  testAge : Number,
  testPregnancies : Number,
  testGlucose : Number,
  testBloodPressure : Number,
  testSkinThickness : Number,
  testInsulin : Number,
  testBMI : Number,
  testPedigreeFunction : Number,
  testDiabetesResult : Number
});

const patientSchema = new mongoose.Schema({
  patientName: String,
  patientPhoneNo:String,
  patientAge:Number,
  patientPassword:String,
  patientPublicAddress: String,
  hospitalId:String,
  doctorId:String,
  testsData: [patientDiabetesDataSchema]
});

const doctorSchema = new mongoose.Schema({
  doctorName: String,
  publicAddress: String,
  patientsList: [patientSchema],
});

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  hospitalPublicAddress: String,
  doctorsList: [doctorSchema],
});

const DoctorModel = new mongoose.model("Doctor", doctorSchema);
const HospitalModel = new mongoose.model("Hospital", hospitalSchema);
const PatientModel = new mongoose.model("Patient", patientSchema);
const PatientDiabetesDataModel = new mongoose.model("PatientTest",patientDiabetesDataSchema);

module.exports = {
  Hospital: HospitalModel,
  Doctor: DoctorModel,
  Patient: PatientModel,
  PatientDiabetesData : PatientDiabetesDataModel
};

// db.hospitals.insert({hospitalName:"Hospital one",hospitalPublicAddress:"0xfa22002a52d93259011311080df654c221092eed",doctorsList:[]})
