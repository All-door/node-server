var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-then');
var User = models.User;

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password'
},function(userid,password,done){
  var user = {};
  User.findOne({ email : userid, disable : false }).then(function(doc){
    if( doc == null){
      done(null,false);
    }else{
      user = {
        userid : doc._id,
        name : doc.name,
        email : doc.email
      }
      return bcrypt.compare(password,doc.password);
    }
  }).then(function(result){
    if( result == true){
      done(null,user);
    }else{
      done(null,false);
    }
  });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = passport;
