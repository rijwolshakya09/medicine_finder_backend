const express = require("express");
const router = express.Router();

//Model Imports
const Medicine = require("../models/medicineModel");
const auth = require("../middleware/auth");
const uploadFile = require("../file/uploadFile");

// route to add Medicine by pharmacy
router.post(
  "/medicine/add",
  auth.pharmacyGuard,
  uploadFile.single("medicine_image"),
  (req, res) => {
    if (req.file == undefined) {
      return res.status(401).json({
        msg: "Invalid file formate",
      });
    }
    const medicine_name = req.body.medicine_name;
    const medicine_price = req.body.medicine_price;
    const medicine_description = req.body.medicine_description;
    const medicine_image = req.file.filename;
    const status = req.body.status;
    const pharmacyId = req.pharmacyInfo._id;

    const data = new Medicine({
      medicine_image: medicine_image,
      medicine_name: medicine_name,
      medicine_price: medicine_price,
      medicine_description: medicine_description,
      status: status,
      pharmacyId: pharmacyId,
    });
    data
      .save()
      .then(() => {
        res.status(201).json({
          success: true,
          msg: "Medicine Added Successfully",
        });
      })
      .catch((e) => {
        res.json({
          msg: e,
        });
      });
  }
);

// route to get MEdicine by Pharmacy
router.get("/medicine/getbyPharmacy", auth.pharmacyGuard, (req, res) => {
  Medicine.find({ pharmacyId: req.pharmacyInfo._id })
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

// route to get medicine by all user
router.get("/medicine/getall", (req, res) => {
  Medicine.find()
    .populate("pharmacyId")
    .then((medicine) => {
      if (medicine != null) {
        res.status(200).json({
          success: true,
          data: medicine,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// route to get medicine by all user
router.get("/medicine/all", (req, res) => {
  Medicine.find()
    .populate("pharmacyId")
    .then((medicine) => {
      if (medicine != null) {
        res.status(200).json({
          success: true,
          data: medicine,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// route to get one medicine by all user
router.get("/medicine/getone/:id", (req, res) => {
  Medicine.findOne({
    _id: req.params.id,
  })
    .populate("pharmacyId")
    .then((medicine) => {
      if (medicine != null) {
        res.status(200).json({
          success: true,
          data: medicine,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

//Router To Update Medicine
router.put(
  "/medicine/update",
  auth.pharmacyGuard,
  uploadFile.single("medicine_image"),
  (req, res) => {
    const medicine_name = req.body.medicine_name;
    const medicine_price = req.body.medicine_price;
    const medicine_description = req.body.medicine_description;
    const status = req.body.status;
    const id = req.body._id;
    if (req.file == undefined) {
      Medicine.updateOne(
        { _id: id },
        {
          medicine_name: medicine_name,
          medicine_price: medicine_price,
          medicine_description: medicine_description,
          status: status,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Medicine Updated Successfully", success: true });
        })
        .catch((e) => {
          res.status(400).json({ msg: e });
        });
    } else {
      Medicine.updateOne(
        { _id: id },
        {
          medicine_name: medicine_name,
          medicine_price: medicine_price,
          medicine_description: medicine_description,
          status: status,
          medicine_image: req.file.filename,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Medicine Updated Successfully", success: true });
        })
        .catch((e) => {
          res
            .status(400)
            .json({ msg: "Something Went Wrong, Please Try Again!!!" });
        });
    }
  }
);

//Router To Delete Book
router.delete("/medicine/delete/:medicineId", auth.pharmacyGuard, (req, res) => {
  console.log(req.params.medicineId);
  Medicine.deleteOne({ _id: req.params.medicineId })
    .then(() => {
      res.status(201).json({ msg: "Medicine Deleted Successfully", success: true });
    })
    .catch((e) => {
      res
        .status(400)
        .json({ msg: "Something Went Wrong, Please Try Again!!!" });
    });
});

router.get("/medicine/count", async (req, res) => {
  let count = 0;
  try {
    count += await Medicine.count();

    res.status(200).json({
      success: true,
      count: count,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e,
    });
  }
});

module.exports = router;
