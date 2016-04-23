'use strict'
let shortid = require('shortid');
let mongoose = require('mongoose');

let ReviewSchema = mongoose.Schema({
  _id : { type : String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  reservation_id : { type : String, required : [true,'예약 정보가 필요합니다.']},
  room_id : { type : String, required : [true,'방 정보가 필요합니다.']},
  user_id : { type : String, required : [true,'유저 정보가 필요합니다.']},
  title : { type : String, required : [true,'제목 정보가 필요합니다.']},
  detail : { type : String, required : [true,'내용 정보가 필요합니다.']},
  view_count : { type : Number, default : 0 },
  images : Array
});

module.exports = ReviewSchema;
