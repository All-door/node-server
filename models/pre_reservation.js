'use strict';
let shortid = require('shortid');
let mongoose = require('mongoose');
let timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-4]):[0][0]$/;
let statusEnum = ['예약중','예약완료','대기시간 초과'];
let TimeValidator = (v)=>{
  return timeRegex.test(v);
};
let statusValiadtor = (v)=>{
  return statusEnum.indexOf(v) != -1 ? true : false;
}

let PreReservationSchema = mongoose.Schema({
  _id : { type: String, default : shortid.generate },
  createdAt : { type: Date, expires: 60*5, default: Date.now },
  room_id : { type : String, required : [ true , "공간 정보가 필요합니다."]},
  user_id : { type : String, required : [ true , "유저 정보가 필요합니다."]},
  start_day : { type : String, required : [ true , "시작 시간 정보가 필요합니다."]},
  start_time : { type : String, default : "00:00", validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 1시간 단위)'
  } },
  end_day : { type : String, required : [ true, "종료 시간 정보가 필요합니다."]},
  end_time : { type : String, default : "00:00", validate : {
    validator : TimeValidator,
    message : '시간 정보 형식이 잘못되었습니다 (HH:MM 1시간 단위)'
  }}
});

module.exports = PreReservationSchema;
