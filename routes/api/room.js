'use strict'
const express = require('express');
const router = express.Router();
const Room = require('../../controller/room');

router.get('/', (req, res, next)=>{
  Room.GetRooms(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : docs
      }).status(200);
    }
  });
});

router.get('/sort/view', (req,res,next)=>{
  Room.GetRoomsByView(req.query.offset,req.query.limit,(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/sort/reservation', (req,res,next)=>{
  Room.GetRoomsByReservation(req.query.offset,req.query.limit,(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/sort/favorite', (req,res,next)=>{
  Room.GetRoomsByFavorite(req.query.offset,req.query.limit,(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/:room_id', (req,res,next)=>{
  let room_id = req.params.room_id;
  Room.GetRoomByRoomId(room_id,(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/tag/:tag', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{},(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/tag/:tag/sort/view', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ view_count : -1},(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/tag/:tag/sort/reservation', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ reservation_count : -1},(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/tag/:tag/sort/favorite', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ favorite_count : -1},(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/type/:type', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{},(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/type/:type/sort/view', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ view_count : -1 },(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/type/:type/sort/favorite', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ favorite_count : -1 },(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});

router.get('/type/:type/sort/reservation', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ reservation_count : -1 },(err,doc)=>{
    if(err){
      res.json({
        "status" : 500,
        "message" : err
      }).status(500);
    }else{
      res.json({
        "status" : 200,
        "data" : doc
      }).status(200);
    }
  });
});
module.exports = router;
