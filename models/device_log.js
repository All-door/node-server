'use strict'
let shortid = require('shortid');
let mongoose = require('mongoose');

let DeviceLogSchema = mongoose.Schema({
  _id : { type : String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  room_id : { type : String },
  pass_status : { type : Boolean },
  battery_status : { type : Number }
});

module.exports = DeviceLogSchema;
