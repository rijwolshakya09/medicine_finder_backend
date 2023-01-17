const express = require("express");
const router = express.Router();

//Model Imports
const Medicine = require("../models/medicineModel");
const auth = require("../middleware/auth");
const uploadFile = require("../file/uploadFile");
const BookMedicine = require("../models/bookMedicineModel");

// route to add Medicine by pharmacy
router.post("/medicine/book", auth.userGuard, (req, res) => {
  const medicine = req.body.medicine;
  const user = req.userInfo._id;
  const quantity = req.body.quantity;
  const total_price = req.body.total_price;
  const status = req.body.status;

  const data = new BookMedicine({
    medicine: medicine,
    user: user,
    quantity: quantity,
    total_price: total_price,
    status: status,
  });
  data
    .save()
    .then(() => {
      res.status(201).json({
        success: true,
        msg: "Medicine Booked Successfully",
      });
    })
    .catch((e) => {
      res.json({
        msg: e,
      });
    });
});

// route to get MEdicine by Pharmacy
router.get("/medicine/booked", auth.userGuard, (req, res) => {
  BookMedicine.find({ user: req.userInfo._id })
    .sort({
      createdAt: "desc",
    })
    .then((medicine) => {
      res.status(201).json({
        success: true,
        data: medicine,
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// // route to get medicine by all user
// router.get("/medicine/get/:pharmacyId", (req, res) => {
//   Medicine.find({ pharmacyId: req.params.pharmacyId })
//     .populate("pharmacyId")
//     .then((medicine) => {
//       if (medicine != null) {
//         res.status(200).json({
//           success: true,
//           data: medicine,
//         });
//       }
//     })
//     .catch((e) => {
//       res.status(400).json({
//         msg: e,
//       });
//     });
// });


//Router To Delete Booked Medicine 
router.delete(
  "/medicine/delete/:bookedMedicineId",
  auth.pharmacyGuard,
  (req, res) => {
    console.log(req.params.bookedMedicineId);
    BookMedicine.deleteOne({ _id: req.params.bookedMedicineId })
      .then(() => {
        res
          .status(201)
          .json({ msg: "Medicine Deleted Successfully", success: true });
      })
      .catch((e) => {
        res
          .status(400)
          .json({ msg: "Something Went Wrong, Please Try Again!!!" });
      });
  }
);

module.exports = router;
