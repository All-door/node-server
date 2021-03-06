'use strict'
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcrypt-then');
const User = models.User;

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password'
},(userid,password,done)=>{
  let user = {};
  User
  .findOne({ email : userid, disable : false })
  .then((doc)=>{
    if( doc === null){
      done(null,false);
    }else{
      user = {
        userid : doc._id,
        name : doc.name,
        email : doc.email,
        phoneNumber : doc.phoneNumber
      };
      return bcrypt.compare(password,doc.password);
    }
  })
  .then((result)=>{
    if( result === true){
      done(null,user);
    }else{
      done(null,false);
    }
  });
}));

passport.use(new FacebookStrategy({
  clientID: '239049116459438',
  clientSecret: 'ff2f8d96fdd5647d6d7711f2bd60d07b',
  callbackURL: process.env.NODE_ENV == 'production'? "http://all-door.net/login/facebook/callback":"http://localhost:3000/login/facebook/callback",
  profileFields: ['id', 'emails', 'name']
},
function(accessToken,refreshToken,profile,done){
  User
  .findOne({ facebookId : profile.id })
  .then((doc)=>{
    if(doc == null){
      new User({
        name : profile._json.last_name.match(/[^a-zA-Z]/) == null ?
        profile._json.last_name + " " + profile._json.first_name : // 이름이 영문일 경우
         profile._json.last_name + profile._json.first_name, // 이름이 영문이 아닐 경우
        facebookId : profile.id,
        email : "None",
        phoneNumber : ""
      })
      .save()
      .then((doc)=>{
        done(null,{
          userid : doc._id,
          facebookId : profile.id,
          name : doc.name,
          email : doc.email,
          phoneNumber : doc.phoneNumber
        });
      });
    }else{
      done(null,{
        userid : doc._id,
        facebookId : profile.id,
        name : doc.name,
        email : doc.email,
        phoneNumber : doc.phoneNumber
      });
    }
  });
}));

passport.serializeUser((user, done)=>{
    done(null, user);
});

passport.deserializeUser((user, done)=>{
    done(null, user);
});

module.exports = passport;
