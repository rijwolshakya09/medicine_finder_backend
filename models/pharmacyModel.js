const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

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
  lat:{
    type: mongoose.Schema.Types.Double,
  },
  lng:{
    type: mongoose.Schema.Types.Double,
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
