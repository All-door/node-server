'use strict'
let express = require('express');
let router = express.Router();
let bcrypt = require('bcrypt-then');
let passport = require('../../controller/passport');
let User = require('../../controller/user');

/*
* 로그인된 유저 정보
* GET /api/user
*/
router.get('/',(req, res, next)=>{
  User.CheckSession(req, (result, user)=>{
    if(result === true){
      response.User(res,user);
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 유저 정보 수정하기
* PUT /api/user
*/
router.put('/',(req, res, next)=>{
  if( !req.body.origin_password || !req.body.change_password){
    response.Message(res,"입력된 데이터를 확인해주세요.");
    return;
  }

  User.CheckSession(req, (result, user)=>{
    if(result === true){
      let origin_password = req.body.origin_password;
      let change_password = req.body.change_password;
      User.ChangeUserPassword(req.user.userid,origin_password,change_password,(err, doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"비밀번호 변경이 완료되었습니다.");
        }
      });

    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 회원 탈퇴하기
* DELETE /api/user
*/
router.delete('/',(req, res, next)=>{
  User.CheckSession(req, (result, user)=>{
    if(result === true){
      User.RemoveUser(user.userid);
      User.LogOut(req);
      response.Message(res,"회원 탈퇴가 완료되었습니다.");
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 회원 가입하기
* POST /api/user/signup
*/
router.post('/signup',(req, res, next)=>{
  let body = req.body;

  User.SignUp(body.name, body.email, body.password, body.phoneNumber,(err, doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Message(res,"회원가입에 완료되었습니다.");
    }
  });
});

/*
* 로그인
* POST /api/user/login
*/
router.post('/login',passport.authenticate('local'),(req,res,next)=>{
  User.ChangeLoginAt(req.user.userid);
  response.Login(res,req.user);
});

/*
* 로그아웃
* GET /api/user/logout
*/
router.get('/logout',(req,res,next)=>{
  User.LogOut(req, (result)=>{
    if(result === true){
      response.Message(res,"로그아웃에 성공했습니다");
    }else {
      response.AuthFail(res);
    }
  });
});

module.exports = router;
