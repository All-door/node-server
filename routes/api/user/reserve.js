'use strict'
const express = require('express');
const router = express.Router();
const Reserve = require('../../../controller/reserve');
const User = require('../../../controller/user');

router.get('/room',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Reserve.GetResevationByUserId(req.query.offset,req.query.limit,user.userid,(err,docs)=>{
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "data" : docs
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

router.post('/room/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let body = req.body;
      let reservation = {
        user_id : user.userid,
        room_id : req.params.room_id,
        start_day : body.start_day,
        start_time : body.start_time,
        end_day : body.end_day,
        end_time : body.end_time,
        password : body.password
      };
      Reserve.ReserveRoom(reservation,(err,doc)=>{
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "message" : doc
          }).stauts(200);
        }
      });
    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
    }
  })
});

module.exports = router;
