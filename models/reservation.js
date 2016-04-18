var shortid = require('shortid');
var mongoose = require('mongoose');
var timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0][0]$/;
var TimeValidator = function(v){
  return timeRegex.test(v);
};

var ReservationSchema = mongoose.Schema({
  _id : { type: String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  room_id : { type : String, required : [ true , "공간 정보가 필요합니다."]},
  user_id : { type : String, required : [ true , "유저 정보가 필요합니다."]},
  start_day : { type : Date, required : [ true , "시작 시간 정보가 필요합니다."]},
  start_time : { type : String, default : "00:00", validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 1시간 단위)'
  } },
  end_day : { type : Date, required : [ true, "종료 시간 정보가 필요합니다."]},
  end_time : { type : String, default : "00:00", validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 1시간 단위)'
  }},
  password : { type : String, required : [ true, "비밀번호 정보가 필요합니다."]}
});

module.exports = ReservationSchema;
