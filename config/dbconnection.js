const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://rijwolshakya09:N%40ruto_Uzumaki09@medicinefinder.9depvzr.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error");
    process.exit(1);
  }
};

module.exports = connectDB;
