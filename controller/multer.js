'use strict'
const config = require('../config');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  'destination' : (req, file, cb) => {
    cb(null, config.ImagePath);
  },
  'filename' : (req, file, cb) => {
    cb(null, file.fieldname + '-'+ shortid() + '-' + Date.now()+path.extname(file.originalname));
  }
});
const upload = multer({ storage : storage });

module.exports = upload;
