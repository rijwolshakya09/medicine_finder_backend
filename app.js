const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Importing Database Connection
const connectDB = require("./config/dbconnection");
connectDB();

app.use(express.static(__dirname + "/pharmacistImages"));
app.use(express.static(__dirname + "/pharmacyImages"));
app.use(express.static(__dirname + "/medicineImages"));
app.use(express.static(__dirname + "/profileuserImages"));

//Routers Are Imported Here
const pharmacyRouter = require("./routers/pharmacyRouter");
const medicineRouter = require("./routers/medicineRouter");
const userRouter = require("./routers/userRouter");

//Routers Are Used Here
app.use(pharmacyRouter);
app.use(medicineRouter);
app.use(userRouter);



const server = app.listen(90);

module.exports = app;
