const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const router = new express.Router();
const jwt = require("jsonwebtoken");
const uploadFile = require("../file/uploadFile");
//Model Imports
const Pharmacy = require("../models/pharmacyModel");
const auth = require("../middleware/auth");

// For Registering Process of Pharmacy
router.post(
  "/pharmacy/register",
  uploadFile.fields([
    {
      name: "profile_pic",
      maxCount: 1,
    },
    {
      name: "pharmacy_pic",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    const username = req.body.username;
    Pharmacy.findOne({ username: username })
      .then((pharmacy_data) => {
        if (pharmacy_data != null) {
          res
            .status(200)
            .json({ msg: "Username Already Exists", success: "exists" });
          return;
        }
        if (req.files.profile_pic == undefined) {
          return res.status(401).json({
            msg: "Invalid Image format",
          });
        }
        if (req.files.pharmacy_pic == undefined) {
          return res.status(401).json({
            msg: "Invalid Audio format",
          });
        }
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const pharmacy_name = req.body.pharmacy_name;
        const description = req.body.description;
        const address = req.body.address;
        const contact_no = req.body.contact_no;
        const profile_pic = req.files.profile_pic[0].filename;
        const pharmacy_pic = req.files.pharmacy_pic[0].filename;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        bcryptjs.hash(password, 10, (e, hashed_pw) => {
          const data = new Pharmacy({
            first_name: first_name,
            last_name: last_name,
            pharmacy_name: pharmacy_name,
            description: description,
            address: address,
            contact_no: contact_no,
            profile_pic: profile_pic,
            pharmacy_pic: pharmacy_pic,
            email: email,
            username: username,
            password: hashed_pw,
            userType: "pharmacy",
          });
          data
            .save()
            .then(() => {
              res.status(201).json({
                msg: "Pharmacy Registered Successfully",
                success: true,
              });
            })
            .catch((e) => {
              res
                .status(401)
                .json({ msg: "Something Went Wrong, Please Try Again!! " });
            });
        });
      })
      .catch();
  }
);

// For Login Process of Pharmacy
router.post("/pharmacy/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Pharmacy.findOne({ username: username })
    .then((pharmacy_data) => {
      if (pharmacy_data == null) {
        res.status(404).json({ msg: "Invalid Credentials!!!" });
        return;
      }
      bcryptjs.compare(password, pharmacy_data.password, (e, result) => {
        if (result == false) {
          res.status(401).json({ msg: "Invalid Credentials!!!" });
          return;
        }
        //It creates token for the logged in user...
        //The token stores the logged in user`s ID...
        const token = jwt.sign(
          { pharmacyId: pharmacy_data._id },
          "medicinefinder"
        );
        res
          .status(201)
          .json({ token: token, userType: pharmacy_data.userType });
      });
    })
    .catch();
});

router.get("/pharmacy/get", auth.pharmacyGuard, (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      first_name: req.pharmacyInfo.first_name,
      last_name: req.pharmacyInfo.last_name,
      pharmacy_name: req.pharmacyInfo.pharmacy_name,
      description: req.pharmacyInfo.description,
      address: req.pharmacyInfo.address,
      contact_no: req.pharmacyInfo.contact_no,
      profile_pic: req.pharmacyInfo.profile_pic,
      pharmacy_pic: req.pharmacyInfo.pharmacy_pic,
      email: req.pharmacyInfo.email,
      username: req.pharmacyInfo.username,
      userType: req.pharmacyInfo.userType,
    },
  });
});

router.get("/pharmacy/getall", (req, res) => {
  Pharmacy.find()
    .then((pharmacies) => {
      if (pharmacies != null) {
        res.status(201).json({
          success: true,
          data: pharmacies,
        });
      }
    })
    .catch((e) => {
      res.status(400).json({
        msg: e,
      });
    });
});

// router.get("/user/getadmin", auth.adminGuard, (req, res) => {
//   res.status(201).json({
//     success: true,
//     data: {
//       first_name: req.adminInfo.first_name,
//       last_name: req.adminInfo.last_name,
//       address: req.adminInfo.address,
//       contact_no: req.adminInfo.contact_no,
//       gender: req.adminInfo.gender,
//       username: req.adminInfo.username,
//       email: req.adminInfo.email,
//       profile_pic: req.adminInfo.profile_pic,
//       userType: req.adminInfo.userType,
//     },
//   });
// });

// // get book owner details
// router.get("/bookowner/get/:id", (req, res) => {
//   User.findOne({
//     _id: req.params.id,
//   })
//     .then((data) => {
//       if (data != null) {
//         res.status(200).json({
//           success: true,
//           data: data,
//         });
//       }
//     })
//     .catch((e) => {
//       res.status(400).json({
//         msg: e,
//       });
//     });
// });

// router.put(
//   "/profile/update",
//   auth.userGuard,
//   uploadFile.single("user_img"),
//   (req, res) => {
//     if (req.file == undefined) {
//       User.updateOne(
//         { _id: req.userInfo._id },
//         {
//           username: req.body.username,
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           address: req.body.address,
//           contact_no: req.body.contact_no,
//           gender: req.body.gender,
//           email: req.body.email,
//         }
//       )
//         .then(() => {
//           res
//             .status(201)
//             .json({ msg: "User Profile Updated Successfully", success: true });
//         })
//         .catch((e) => {
//           res.status(400).json({ msg: e });
//         });
//     } else {
//       User.updateOne(
//         { _id: req.userInfo._id },
//         {
//           username: req.body.username,
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           address: req.body.address,
//           contact_no: req.body.contact_no,
//           gender: req.body.gender,
//           email: req.body.email,
//           profile_pic: req.file.filename,
//         }
//       )
//         .then(() => {
//           res
//             .status(201)
//             .json({ msg: "User Profile Updated Successfully", success: true });
//         })
//         .catch((e) => {
//           res
//             .status(400)
//             .json({ msg: "Something Went Wrong, Please Try Again!!!" });
//         });
//     }
//   }
// );

// router.put("/password/update", auth.userGuard, (req, res) => {
//   const old_password = req.body.old_password;
//   const new_password = req.body.new_password;
//   User.findOne({
//     _id: req.userInfo._id,
//   })
//     .then((user_data) => {
//       if (user_data == null) {
//         res.json({
//           msg: "Invalid Credentials",
//         });
//         return;
//       }
//       bcryptjs.compare(old_password, user_data.password, (e, result) => {
//         if (result == false) {
//           res.json({
//             msg: "Incorrect password",
//           });
//           return;
//         }
//         bcryptjs.hash(new_password, 10, (e, hashed_pw) => {
//           User.updateOne(
//             { _id: req.userInfo._id },
//             {
//               password: hashed_pw,
//             }
//           )
//             .then(
//               res.status(200).json({
//                 msg: "Password changed",
//                 success: true,
//               })
//             )
//             .catch((e) => {
//               res.json({
//                 msg: e,
//               });
//             });
//         });
//       });
//     })
//     .catch((e) => {
//       res.json({
//         success: false,
//         msg: e,
//       });
//     });
// });

// // admin update profile
// router.put(
//   "/profile/updateadmin",
//   auth.adminGuard,
//   uploadFile.single("user_img"),
//   (req, res) => {
//     if (req.file == undefined) {
//       User.updateOne(
//         { _id: req.adminInfo._id },
//         {
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           address: req.body.address,
//           contact_no: req.body.contact_no,
//           gender: req.body.gender,
//         }
//       )
//         .then(() => {
//           res
//             .status(201)
//             .json({ msg: "Admin Profile Updated Successfully", success: true });
//         })
//         .catch((e) => {
//           res.status(400).json({ msg: e });
//         });
//     } else {
//       User.updateOne(
//         { _id: req.adminInfo._id },
//         {
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           address: req.body.address,
//           contact_no: req.body.contact_no,
//           gender: req.body.gender,
//           profile_pic: req.file.filename,
//         }
//       )
//         .then(() => {
//           res
//             .status(201)
//             .json({ msg: "Admin Profile Updated Successfully", success: true });
//         })
//         .catch((e) => {
//           res
//             .status(400)
//             .json({ msg: "Something Went Wrong, Please Try Again!!!" });
//         });
//     }
//   }
// );

// // admin password change
// router.put("/password/updateadmin", auth.adminGuard, (req, res) => {
//   const old_password = req.body.old_password;
//   const new_password = req.body.new_password;
//   User.findOne({
//     _id: req.adminInfo._id,
//   })
//     .then((user_data) => {
//       if (user_data == null) {
//         res.json({
//           msg: "Invalid Credentials",
//         });
//         return;
//       }
//       bcryptjs.compare(old_password, user_data.password, (e, result) => {
//         if (result == false) {
//           res.json({
//             msg: "Incorrect password",
//           });
//           return;
//         }
//         bcryptjs.hash(new_password, 10, (e, hashed_pw) => {
//           User.updateOne(
//             { _id: req.adminInfo._id },
//             {
//               password: hashed_pw,
//             }
//           )
//             .then(
//               res.status(200).json({
//                 msg: "Password changed",
//                 success: true,
//               })
//             )
//             .catch((e) => {
//               res.json({
//                 msg: e,
//               });
//             });
//         });
//       });
//     })
//     .catch((e) => {
//       res.json({
//         success: false,
//         msg: e,
//       });
//     });
// });

// router.get("/users/count", async (req, res) => {
//   let count = 0;
//   try {
//     count += await User.count();
//     res.status(200).json({
//       success: true,
//       count: count,
//     });
//   } catch (e) {
//     res.status(400).json({
//       success: false,
//       error: e,
//     });
//   }
// });

module.exports = router;
