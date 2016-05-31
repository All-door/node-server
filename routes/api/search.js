'use strict'
const express = require('express');
const router = express.Router();
const Room = require('../../controller/room');

router.get('/',(req,res,next)=>{
  let query = {
    type : req.query.type,
    tag : req.query.tag,
    start_day : req.query.start_day,
    start_time : req.query.start_time,
    end_day : req.query.end_day,
    end_time : req.query.end_time,
    capacity : req.query.capacity
  };
  Room.GetVancancyRoomsByQuery(req.query.offset,req.query.limit,query,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

module.exports = router;
