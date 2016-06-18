const shortid = require('shortid');
const mongoose = require('mongoose');
const DeviceSchema = mongoose.Schema({
  _id : { type : String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  privateKey : { type : String, default : shortid.generate }
});

module.exports = DeviceSchema;
