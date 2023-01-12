const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//User Model Collection Create
const User = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  address: {
    type: String,
  },
  contact_no: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
  },
  profile_picture: {
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
    required: true,
  },
  userType: {
    type: String,
  },
});

module.exports = mongoose.model("User", User);
