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
  const userId = req.userInfo._id;
  const quantity = req.body.quantity;
  const total_price = req.body.total_price;
  const status = req.body.status;
  console.log(userId);
  const data = new BookMedicine({
    medicine: medicine,
    userId: userId,
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
  BookMedicine.find({ userId: req.userInfo._id })
    .sort({
      createdAt: "desc",
    })
    .populate("medicine")
    .populate("userId")
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

// route to get MEdicine by Pharmacy
router.get("/medicine/bookedphar",  (req, res) => {
  BookMedicine.find({})
    .sort({
      createdAt: "desc",
    })
    .populate("medicine")
    .populate("userId")
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

// route to get MEdicine by Pharmacy
router.get("/medicine/bookmedphar", auth.pharmacyGuard, (req, res) => {
    BookMedicine.find({})
      .then((bookmed) => {
        if (bookmed != null) {
            Medicine.findOne({ pharmacyId: req.pharmacyInfo._id }).then((medicine) => {
              console.log(medicine.pharmacyId);
              res.status(200).json({
                success: true,
                data: medicine,
              })
              // BookMedicine.find({ pharmacy: { $in: medicine.pharmacyId } }).then((pharmed) => {
              //   res.status(200).json({
              //     success: true,
              //     data: pharmed,
              //   });
              // });
            });
          }
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

// router to change status of booked medicine
router.put("/medicine/pickedup", auth.pharmacyGuard, (req, res) => {
  BookMedicine.updateOne(
    {
      _id: req.body.id,
    },
    {
      status: "Picked Up",
    }
  )
    .then(() => {
      res.status(201).json({
        msg: "Medicine Picked Up Successful",
      });
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

//Router To Delete Booked Medicine
router.delete(
  "/bookmedicine/delete/:bookedMedicineId",
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
