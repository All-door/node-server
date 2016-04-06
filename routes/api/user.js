var express = require('express');
var router = express.Router();
var User = models.User;
var bcrypt = require('bcrypt-then');
var passport = require('../../controller/passport');
/*
* /api/user
*/

router.get('/',function(req, res, next) {
  if(req.isAuthenticated()){
    res.json({
      "status" : 200,
      "data" : req.user
    }).status(200);
  }else{
    res.json({
      "status" : 401,
      "message" : "인증되지 않은 접근입니다"
    }).status(401);
  }
});

router.put('/',function(req, res, next) {

});

router.delete('/',function(req, res, next) {

});

/*
* /api/user/signup
*/
router.post('/signup',function(req, res, next) {
  var body = req.body;
  var email = body.email;

  if( !body.email || !body.name || !body.password){
    res.json({
      "status" : 400,
      "message" : "입력된 데이터를 확인해주세요."
    }).status(400).end();
    return;
  }

  User.findOne({ email : email }).then(function(doc){
    if( doc == null){
      return bcrypt.hash(body.password,10);
    }else{
      throw new Error("중복된 이메일 입니다.");
    }
  }).then(function(password_token){
    var user = new User({
      name : body.name,
      email : body.email,
      password : password_token
    });
    return user.save();
  }).then(function(doc){
    if(doc == null){
      throw new Error("회원가입에 실패했습니다");
    }else{
      res.json({
        "status" : 200,
        "message" : "회원가입에 성공했습니다."
      }).status(200).end();
    }
  }).catch(function(err){
    res.json({
      "status" : 400,
      "message" : err.message
    }).status(400).end();
  });
});

/*
* /api/user/login
*/
router.post('/login',passport.authenticate('local'),function(req,res,next){
  res.json({
    "status" : 200,
    "message" : "로그인에 성공했습니다."
  }).status(200).end();
});

/*
* /api/user/logout
*/
router.get('/logout',function(req,res,next){
  if(req.isAuthenticated()){
    req.logout();
    res.json({
      "status" : 200,
      "message" : "로그아웃에 성공했습니다."
    }).status(200).end();
  }else{
    res.json({
      "status" : 401,
      "message" : "인증되지 않은 접근입니다"
    }).status(401);
  }
});

/*
* /api/user/favorites
*/

router.get('/favorites',function(req, res, next) {

});

router.post('/favorites',function(req, res, next) {

});

router.delete('/favorites',function(req, res, next) {

});

module.exports = router;
