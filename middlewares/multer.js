const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Set storage engine
const storage = multer.diskStorage({
  destination: "public/files",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("file");

module.exports = { upload };