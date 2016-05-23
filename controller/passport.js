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
      console.log(user);
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
  callbackURL: "http://localhost:3000/login/facebook/callback",
  profileFields: ['id', 'emails', 'name']
},
function(accessToken,refreshToken,profile,done){
  User
  .findOne({ facebookId : profile.id })
  .then((doc)=>{
    if(doc == null){
      new User({
        name : profile._json.last_name + profile._json.first_name,
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
