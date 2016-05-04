'use strict'
const express = require('express');
const router = express.Router();
const Reserve = require('../../../controller/reserve');

/*
* 특정 공간(방)의 예약된 정보 가지고 가지고 오기
* GET /api/room/:room_id/reservation
*/
router.get('/:room_id/reservation',(req,res,next)=>{
  Reserve.GetReservationByRoomId(req.query.offset,req.query.limit,req.params.room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

module.exports = router;
