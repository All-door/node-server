'use strict'
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt-then');
let passport = require('../../controller/passport');
let User = require('../../controller/user');

/*
* /api/user
*/

router.get('/',(req, res, next)=>{
  User.CheckSession(req, (result, user)=>{
    if(result === true){
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

router.put('/',(req, res, next)=>{
  if( !req.body.origin_password || !req.body.change_password){
    res.json({
      "status" : 400,
      "message" : "입력된 데이터를 확인해주세요."
    }).status(400).end();
    return;
  }

  User.CheckSession(req, (result, user)=>{
    if(result === true){
      let origin_password = req.body.origin_password;
      let change_password = req.body.change_password;
      User.ChangeUserPassword(req.user.userid,origin_password,change_password,(err, doc)=>{
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

router.delete('/',(req, res, next)=>{
  User.CheckSession(req, (result, user)=>{
    if(result === true){
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
router.post('/signup',(req, res, next)=>{
  let body = req.body;

  if( !body.email || !body.name || !body.password){
    res.json({
      "status" : 400,
      "message" : "입력된 데이터를 확인해주세요."
    }).status(400).end();
    return;
  }

  User.SignUp(body.name, body.email, body.password, (err, doc)=>{
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
router.post('/login',passport.authenticate('local'),(req,res,next)=>{
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
router.get('/logout',(req,res,next)=>{
  User.LogOut(req, (result)=>{
    if(result === true){
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
