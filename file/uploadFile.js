const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_pic") {
      cb(null, "./pharmacistImages");
    } else if (file.fieldname === "pharmacy_pic") {
      cb(null, "./pharmacyImages");
    } else if (file.fieldname === "profile_picture") {
      cb(null, "./profileuserImages");
    } else if (file.fieldname === "medicine_image") {
      cb(null, "./medicineImages");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (file.fieldname === "profile_pic") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "pharmacy_pic") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "medicine_image") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "profile_picture") {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
  
};

const uploadFile = multer({
  storage: storage,
  fileFilter: filter,
});

module.exports = uploadFile;
