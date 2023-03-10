const mongoose = require("mongoose");

//Book Model Collection Create
const BookMedicine = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    required: true,
  },
});

module.exports = mongoose.model("BookMedicine", BookMedicine);
