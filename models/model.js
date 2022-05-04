const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: String,
  patientPhoneNo:String,
  patientAge:Number,
  patientPassword:String,
  patientPublicAddress: String,
  hospitalId:String,
  doctorId:String,
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

module.exports = {
  Hospital: HospitalModel,
  Doctor: DoctorModel,
  Patient: PatientModel,
};

// db.hospitals.insert({hospitalName:"Hospital one",hospitalPublicAddress:"0xfa22002a52d93259011311080df654c221092eed",doctorsList:[]})
