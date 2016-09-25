'use strict'
const express = require('express');
const router = express.Router();
const request = require('request');
const Room = require('../../controller/room');
const Rate = require('../../controller/rate');
const User = require('../../controller/user');
const _ = require('lodash');

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
* GET /api/room/:room_id
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
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ reservation_count : -1 },(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 특정 방의 별점 정보 가지고 오기
* GET /api/room/:room_id/rate
*/
router.get('/:room_id/rate',(req,res,next)=>{
  Rate.GetRoomRate(req.params.room_id,(err,rate)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,rate);
    }
  });
});

/*
* 특정 방의 별점 정보 넣기
* POST /api/room/:room_id/rate
*/
router.post('/:room_id/rate',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Rate.InsertRoomRate(user.userid,req.params.room_id,req.body.rate,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,'공간에 대한 별점 입력이 완료되었습니다.');
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.get('/:room_id/artik', (req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let room_id = req.params.room_id;
      Room.GetRoomByRoomId(room_id,(err,docs)=>{
        if(err){
          response.Error(res,err);
        }else{
          if( !docs.artik_cloud_id || !docs.artik_cloud_access_token ){
            response.Error(res,err);
            return;
          }
          const options = { method: 'GET',
            url: 'https://api.artik.cloud/v1.1/messages/last',
            qs: { sdids: docs.artik_cloud_id, count: '10' },
            headers:
             { authorization: 'Bearer ' + docs.artik_cloud_access_token} };

          request(options, (error, response, body)=>{
            const result = JSON.parse(body).data;
            const filtered = _.filter(result, (data)=>{
              return (new Date).getTime() - data.cts < 60 * 60 * 1000;
            });
            const mapped = _.map(filtered, (data)=>{
              return {
                'time' : data.cts,
                'hall' : data.data.Hall ? 1 : 0,
                'temp' : data.data.Temperature,
                'humi' : data.data.Humidity
              }
            });
            res.json({
              "status" : 200,
              "data" : mapped
            });
          });
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});
module.exports = router;
