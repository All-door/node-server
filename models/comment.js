'use strict'
let shortid = require('shortid');
let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
  _id : { type : String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  room_id : { type : String, required : [true,'공간 정보가 필요합니다.']},
  user_id : { type : String, required : [true,'유저 정보가 필요합니다.']},
  content  : { type : String, required : [true,'코멘트 내용이 필요합니다.']}
});

module.exports = CommentSchema;
