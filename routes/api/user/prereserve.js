'use strict';
const express = require('express');
const router = express.Router();
const Reservation = require('../../../controller/reserve');
const User = require('../../../controller/user');

router.post('/room/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let body = req.body;
      let reservation = {
        user_id : user.userid,
        room_id : req.params.room_id,
        start_day : body.start_day,
        end_day : body.end_day,
        start_time : body.start_time,
        end_time : body.end_time
      };

      Reservation.PreReserveRoom(reservation,(err,doc)=>{
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

module.exports = router;
