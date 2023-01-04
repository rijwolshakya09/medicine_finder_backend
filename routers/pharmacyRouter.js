const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const router = new express.Router();
const jwt = require("jsonwebtoken");
const uploadFile = require("../file/uploadFile");
//Model Imports
const Pharmacy = require("../models/pharmacyModel");
const auth = require("../middleware/auth");

// For Registering Process of User
router.post("/user/register", (req, res) => {
  const username = req.body.username;
  User.findOne({ username: username })
    .then((user_data) => {
      if (user_data != null) {
        res
          .status(200)
          .json({ msg: "Username Already Exists", success: "exists" });
        return;
      }
      const username = req.body.username;
      const email = req.body.email;
      const contact_no = req.body.contact_no;
      const password = req.body.password;

      bcryptjs.hash(password, 10, (e, hashed_pw) => {
        const data = new User({
          username: username,
          email: email,
          contact_no: contact_no,
          password: hashed_pw,
          userType: "user",
        });
        data
          .save()
          .then(() => {
            res
              .status(201)
              .json({ msg: "User Registered Successfully", success: true });
          })
          .catch((e) => {
            res
              .status(401)
              .json({ msg: "Something Went Wrong, Please Try Again!! " });
          });
      });
    })
    .catch();
});

// For Login Process of User
router.post("/user/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then((user_data) => {
      if (user_data == null) {
        res.status(404).json({ msg: "Invalid Credentials!!!" });
        return;
      }
      bcryptjs.compare(password, user_data.password, (e, result) => {
        if (result == false) {
          res.status(401).json({ msg: "Invalid Credentials!!!" });
          return;
        }
        //It creates token for the logged in user...
        //The token stores the logged in user`s ID...
        const token = jwt.sign({ userId: user_data._id }, "rentnreaduser");
        res.status(201).json({ token: token, userType: user_data.userType });
      });
    })
    .catch();
});

router.get("/user/get", auth.userGuard, (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      first_name: req.userInfo.first_name,
      last_name: req.userInfo.last_name,
      address: req.userInfo.address,
      contact_no: req.userInfo.contact_no,
      gender: req.userInfo.gender,
      username: req.userInfo.username,
      email: req.userInfo.email,
      profile_pic: req.userInfo.profile_pic,
      userType: req.userInfo.userType,
    },
  });
});

router.get("/user/getadmin", auth.adminGuard, (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      first_name: req.adminInfo.first_name,
      last_name: req.adminInfo.last_name,
      address: req.adminInfo.address,
      contact_no: req.adminInfo.contact_no,
      gender: req.adminInfo.gender,
      username: req.adminInfo.username,
      email: req.adminInfo.email,
      profile_pic: req.adminInfo.profile_pic,
      userType: req.adminInfo.userType,
    },
  });
});

// get book owner details
router.get("/bookowner/get/:id", (req, res) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((data) => {
      if (data != null) {
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

router.put(
  "/profile/update",
  auth.userGuard,
  uploadFile.single("user_img"),
  (req, res) => {
    if (req.file == undefined) {
      User.updateOne(
        { _id: req.userInfo._id },
        {
          username: req.body.username,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          contact_no: req.body.contact_no,
          gender: req.body.gender,
          email: req.body.email,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "User Profile Updated Successfully", success: true });
        })
        .catch((e) => {
          res.status(400).json({ msg: e });
        });
    } else {
      User.updateOne(
        { _id: req.userInfo._id },
        {
          username: req.body.username,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          contact_no: req.body.contact_no,
          gender: req.body.gender,
          email: req.body.email,
          profile_pic: req.file.filename,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "User Profile Updated Successfully", success: true });
        })
        .catch((e) => {
          res
            .status(400)
            .json({ msg: "Something Went Wrong, Please Try Again!!!" });
        });
    }
  }
);

router.put("/password/update", auth.userGuard, (req, res) => {
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  User.findOne({
    _id: req.userInfo._id,
  })
    .then((user_data) => {
      if (user_data == null) {
        res.json({
          msg: "Invalid Credentials",
        });
        return;
      }
      bcryptjs.compare(old_password, user_data.password, (e, result) => {
        if (result == false) {
          res.json({
            msg: "Incorrect password",
          });
          return;
        }
        bcryptjs.hash(new_password, 10, (e, hashed_pw) => {
          User.updateOne(
            { _id: req.userInfo._id },
            {
              password: hashed_pw,
            }
          )
            .then(
              res.status(200).json({
                msg: "Password changed",
                success: true,
              })
            )
            .catch((e) => {
              res.json({
                msg: e,
              });
            });
        });
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        msg: e,
      });
    });
});

// admin update profile
router.put(
  "/profile/updateadmin",
  auth.adminGuard,
  uploadFile.single("user_img"),
  (req, res) => {
    if (req.file == undefined) {
      User.updateOne(
        { _id: req.adminInfo._id },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          contact_no: req.body.contact_no,
          gender: req.body.gender,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Admin Profile Updated Successfully", success: true });
        })
        .catch((e) => {
          res.status(400).json({ msg: e });
        });
    } else {
      User.updateOne(
        { _id: req.adminInfo._id },
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          address: req.body.address,
          contact_no: req.body.contact_no,
          gender: req.body.gender,
          profile_pic: req.file.filename,
        }
      )
        .then(() => {
          res
            .status(201)
            .json({ msg: "Admin Profile Updated Successfully", success: true });
        })
        .catch((e) => {
          res
            .status(400)
            .json({ msg: "Something Went Wrong, Please Try Again!!!" });
        });
    }
  }
);

// admin password change
router.put("/password/updateadmin", auth.adminGuard, (req, res) => {
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  User.findOne({
    _id: req.adminInfo._id,
  })
    .then((user_data) => {
      if (user_data == null) {
        res.json({
          msg: "Invalid Credentials",
        });
        return;
      }
      bcryptjs.compare(old_password, user_data.password, (e, result) => {
        if (result == false) {
          res.json({
            msg: "Incorrect password",
          });
          return;
        }
        bcryptjs.hash(new_password, 10, (e, hashed_pw) => {
          User.updateOne(
            { _id: req.adminInfo._id },
            {
              password: hashed_pw,
            }
          )
            .then(
              res.status(200).json({
                msg: "Password changed",
                success: true,
              })
            )
            .catch((e) => {
              res.json({
                msg: e,
              });
            });
        });
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        msg: e,
      });
    });
});

router.get("/users/count", async (req, res) => {
  let count = 0;
  try {
    count += await User.count();
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
