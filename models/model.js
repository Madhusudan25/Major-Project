const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: String,
  doctorsList: [doctorSchema],
});

const doctorSchema = new mongoose.Schema({
  doctorName: String,
  publicAddress: String,
  patientsList: [patientSchema],
});

const patientSchema = new mongoose.Schema({
  patientName: String,
  publicAddress: String,
});

const Doctormodel = new mongoose.model("Doctor", doctorSchema);
const Hospitalmodel = new mongoose.model("Hospital", hospitalSchema);
const PatientModel = new mongoose.model("Patient", patientSchema);

module.exports = {
  Hospital: Hospitalmodel,
  Doctor: Doctormodel,
  Patient: Patientmodel,
};
