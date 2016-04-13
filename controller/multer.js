var config = require('../config');
var multer = require('multer');
var shortid = require('shortid');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.ImagePath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-'+ shortid() + '-' + Date.now())
  }
});
var upload = multer({ storage : storage });

module.exports = upload;
