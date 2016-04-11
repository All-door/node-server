var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-then');
var passport = require('../../controller/passport');
var User = require('../../controller/user');

/*
* /api/user
*/

router.get('/',function(req, res, next) {
  User.CheckSession(req, function(result, user){
    if(result == true){
      res.json({
        "status" : 200,
        "user" : user
      });
    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
    }
  });
});

router.put('/',function(req, res, next) {

});

router.delete('/',function(req, res, next) {
  User.CheckSession(req, function(result, user){
    if(result == true){
      User.RemoveUser(user.userid);
      User.LogOut(req);
      res.json({
        "status" : 200,
        "message" : "회원 탈퇴가 완료되었습니다."
      }).status(200);
    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
    }
  });
});

/*
* /api/user/signup
*/
router.post('/signup',function(req, res, next) {
  var body = req.body;

  if( !body.email || !body.name || !body.password){
    res.json({
      "status" : 400,
      "message" : "입력된 데이터를 확인해주세요."
    }).status(400).end();
    return;
  }

  User.SignUp(body.name, body.email, body.password, function(err, doc){
    if(err){
      res.json({
        "status" : 400,
        "message" : err
      }).status(400).end();
    }else{
      res.json({
        "status" : 200,
        "message" : "회원가입에 완료되었습니다."
      }).status(200);
    }
  });
});

/*
* /api/user/login
*/
router.post('/login',passport.authenticate('local'),function(req,res,next){
  User.ChangeLoginAt(req.user.userid);
  res.json({
    "status" : 200,
    "message" : "로그인에 성공했습니다."
  }).status(200).end();
});

/*
* /api/user/logout
*/
router.get('/logout',function(req,res,next){
  User.LogOut(req, function(result){
    if(result == true){
      res.json({
        "status" : 200,
        "message" : "로그아웃에 성공했습니다."
      }).status(200).end();
    }else {
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다"
      }).status(401);
    }
  });
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
