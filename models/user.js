'use strict'
let shortid = require('shortid');
let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  _id : { type: String, default : shortid.generate },
  createdAt : { type : Date, default : Date.now },
  updatedAt : { type : Date, default : Date.now },
  loginAt : { type : Date, default : Date.now },
  name : String,
  email : String,
  password : String,
  facebook_token : String,
  isAdmin : Boolean,
  isSupply : Boolean,
  favorite_rooms : Array,
  disable : { type : Boolean, default : false }
});

module.exports = UserSchema;
