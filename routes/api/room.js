'use strict'
const express = require('express');
const router = express.Router();
const Room = require('../../controller/room');

/*
* 모든 공간(방) 정보 가지고 오기
* GET /api/room
*/
router.get('/', (req, res, next)=>{
  Room.GetRooms(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 조회수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/sort/view
*/
router.get('/sort/view', (req,res,next)=>{
  Room.GetRoomsByView(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 예약수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/sort/reservation
*/
router.get('/sort/reservation', (req,res,next)=>{
  Room.GetRoomsByReservation(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 관심수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/sort/reservation
*/
router.get('/sort/favorite', (req,res,next)=>{
  Room.GetRoomsByFavorite(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 특정 공간(방) 정보 가지고 오기
* GET /api/room/:room_d
*/
router.get('/:room_id', (req,res,next)=>{
  let room_id = req.params.room_id;
  Room.GetRoomByRoomId(room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 태그에 따른 공간(방) 정보 가지고 오기
* GET /api/room/tag/:tag
*/
router.get('/tag/:tag', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{},(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 태그에 따른, 조회수에 따른, 공간(방) 정보 가지고 오기
* GET /api/room/tag/:tag/sort/view
*/
router.get('/tag/:tag/sort/view', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ view_count : -1},(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 태그에 따른, 예약수에 따른, 공간(방) 정보 가지고 오기
* GET /api/room/tag/:tag/sort/resevation
*/
router.get('/tag/:tag/sort/reservation', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ reservation_count : -1},(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 태그에 따른, 관심수에 따른, 공간(방) 정보 가지고 오기
* GET /api/room/tag/:tag/sort/favorite
*/
router.get('/tag/:tag/sort/favorite', (req,res,next)=>{
  let tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ favorite_count : -1},(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 타입에 따른 공간(방) 정보 가지고 오기
* GET /api/room/type/:type
*/
router.get('/type/:type', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{},(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 타입에 따른, 조회수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/type/:type
*/
router.get('/type/:type/sort/view', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ view_count : -1 },(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 타입에 따른, 관심수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/type/:type/sort/favorite
*/
router.get('/type/:type/sort/favorite', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ favorite_count : -1 },(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 타입에 따른, 예약수에 따른 공간(방) 정보 가지고 오기
* GET /api/room/type/:type/sort/reservation
*/
router.get('/type/:type/sort/reservation', (req,res,next)=>{
  let type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ reservation_count : -1 },(err,doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});
module.exports = router;
