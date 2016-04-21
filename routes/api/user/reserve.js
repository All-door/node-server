'use strict'
const express = require('express');
const router = express.Router();
const Reservation = require('../../../controller/reserve');
const User = require('../../../controller/user');

router.get('/',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Reservation.GetResevationByUserId(req.query.offset,req.query.limit,user.userid,(err,docs)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Data(res,docs);
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.get('/:reservation_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result == true){
      Reservation.GetReservationByReservationId(user.userid,req.params.reservation_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Data(res,doc);
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.put('/:reservation_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result == true){
      let reservation = {
        reservation_id : req.params.reservation_id,
        password : req.body.password,
        user_id : user.userid
      };

      Reservation.UpdateReservation(reservation,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"예약 정보를 수정했습니다.");
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.delete('/:reservation_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result == true){
      Reservation.RemoveReservation(user.userid,req.params.reservation_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"예약 정보를 삭제했습니다.");
        }
      });
    }else{
      response.AuthFail(res);
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
      Reservation.ReserveRoom(reservation,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Data(res,doc);
        }
      });
    }else{
      response.AuthFail(res);
    }
  })
});

module.exports = router;
