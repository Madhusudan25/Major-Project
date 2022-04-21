const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: String,
  publicAddress: String,
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

// db.hospitals.insert({hospitalName:"Hospital one",hospitalPublicAddress:"0x145aad8e3611965f9732cc1050390bbb14401e3d",doctorsList:[]})
