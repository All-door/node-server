'use strict'
const shortid = require('shortid');
const mongoose = require('mongoose');

const DeviceLogSchema = mongoose.Schema({
  _id : { type : String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  room_id : { type : String, required : [true, '공간 정보가 필요합니다.']},
  device_id : {type : String, required : [ true, '디바이스 정보가 필요합니다.']},
  pass_status : {type : String, enum : ['인증 실패','마스터키 접근','임시키 접근']}
});

module.exports = DeviceLogSchema;
