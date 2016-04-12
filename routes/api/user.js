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
  if( !req.body.origin_password || !req.body.change_password){
    res.json({
      "status" : 400,
      "message" : "입력된 데이터를 확인해주세요."
    }).status(400).end();
    return;
  }

  User.CheckSession(req, function(result, user){
    if(result == true){
      var origin_password = req.body.origin_password;
      var change_password = req.body.change_password;
      User.ChangeUserPassword(req.user.userid,origin_password,change_password,function(err, doc){
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "message" : "비밀번호 변경이 완료되었습니다."
          }).status(200);
        }
      });

    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
    }
  });
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
    "message" : "로그인에 성공했습니다.",
    "user" : req.user
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



module.exports = router;