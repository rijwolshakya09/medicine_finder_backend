const jwt = require("jsonwebtoken");
const pharmacy = require("../models/pharmacyModel");
// const admin = require("../Models/adminModel");

// This Is Guard For Customer...
// module.exports.userGuard = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const data = jwt.verify(token, "medicinefinder");
//     console.log(data);
//     user
//       .findOne({
//         $and: [
//           { _id: data.userId },
//           {
//             userType: "user",
//           },
//         ],
//       })
//       .then((udata) => {
//         req.userInfo = udata;
//         next();
//       })
//       .catch((e) => {
//         res.json({ msg: "Invalid Token" });
//       });
//   } catch (e) {
//     res.json({ msg: "Invalid Token" });
//   }
// };

// This Is Guard For Pharmacy...
module.exports.pharmacyGuard = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, "medicinefinder");
    console.log(data);
    pharmacy
      .findOne({
        $and: [
          { _id: data.pharmacyId },
          {
            userType: "pharmacy",
          },
        ],
      })
      .then((pdata) => {
        req.pharmacyInfo = pdata;
        next();
      })
      .catch((e) => {
        res.json({ msg: "Invalid Token" });
      });
  } catch (e) {
    res.json({ msg: "Invalid Token" });
  }
};
