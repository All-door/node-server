var shortid = require('shortid');
var mongoose = require('mongoose');

var RoomSchema = mongoose.Schema({
  _id : { type: String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  device_id : String,
  user_id : String,
  title : String,
  detail : String,
  type : String,
  room_images : Array,
  day_enable : Array,
  enable_start_time : String,
  enable_end_time : String,
  like : Array,
  comment : Array,
  view : Number,
  reservation_count : Number
});

module.exports = RoomSchema;
