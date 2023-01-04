const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Model Collection Create
const Pharmacy = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  pharmacy_name:{
    type: String,
  },
  description:{
    type: String,
  },
  address: {
    type: String,
  },
  contact_no: {
    type: String,
    // required: true,
  },
  profile_pic: {
    type: String,
  },
  pharmacy_pic : {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  userType: {
    type: String,
  },
});

module.exports = mongoose.model("Pharmacy", Pharmacy);
