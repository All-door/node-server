var shortid = require('shortid');
var mongoose = require('mongoose');
var timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0,3][0]$/;
var TimeValidator = function(v){
  return timeRegex.test(v);
}

var RoomSchema = mongoose.Schema({
  _id : { type: String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  device_id : { type : String, required : [ true , "디바이스 정보가 필요합니다."]},
  user_id : { type : String, required : [ true , "유저 정보가 필요합니다."]},
  title : { type : String, required : [ true , "제목 정보가 필요합니다."]},
  detail : { type : String, required : [ true , "세부사항 정보가 필요합니다."]},
  type : { type : String, enum : ['숙박','회의실','공부방','창고','강당']},
  tag : { type : String, enum : ['선릉역','신림역','길음역','강남역','역삼역','왕십리역']},
  address : { type : String, required : [ true , "주소 정보가 필요합니다."]},
  room_images : Array,
  day_enable : [{ type : String, enum : ['월','화','수','목','금','토','일']}],
  enable_start_time : { type : String, validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 30분단위)'
  }},
  enable_end_time : { type : String, validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 30분단위)'
  }},
  comment : Array,
  favorite_count : { type : Number, default : 0 },
  view_count : { type : Number, default : 0},
  reservation_count : { type : Number, default : 0}
});

module.exports = RoomSchema;