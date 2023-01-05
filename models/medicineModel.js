const mongoose = require("mongoose");

//Book Model Collection Create
const Medicine = new mongoose.Schema({
  medicine_name: {
    type: String,
    required: true,
  },
  medicine_price: {
    type: String,
    required: true,
  },
  medicine_image: {
    type: String,
    required: true,
  },
  medicine_description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
  },
});

module.exports = mongoose.model("Medicine", Medicine);
