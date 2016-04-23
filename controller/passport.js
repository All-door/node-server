'use strict'
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
        email : doc.email
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

passport.serializeUser((user, done)=>{
    done(null, user);
});

passport.deserializeUser((user, done)=>{
    done(null, user);
});

module.exports = passport;
