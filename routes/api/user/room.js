'use strict'
const express = require('express');
const router = express.Router();
const Room = require('../../../controller/room');
const User = require('../../../controller/user');
const config = require('../../../config');
const upload = require('../../../controller/multer');!

/*
* 유저가 등록한 방 정보 가지고 오기
* GET /api/user/room
*/
router.get('/',(req, res, next)=>{
  User.CheckSession(req, (result,user)=>{
    if(result == true){
      Room.GetRoomsByUserId(user.userid,req.query.offset,req.query.limit,(err,docs)=>{
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

/*
* 유저 공간(방) 등록하기
* POST /api/user/room
*/
router.post('/',upload.array('room_image', 5),(req, res, next)=>{
  let room_images = [];
  for(let i=0,len = req.files.length; i<len;i++){
    room_images.push(req.files[i].filename);
  }

  User.CheckSession(req,(result, user)=>{
    if(result === true){
      let user_id = user.userid;
      let device_id = req.body.device_id;
      let title = req.body.title;
      let detail = req.body.detail;
      let type = req.body.type;
      let tag = req.body.tag;
      let day_enable;
      try {
        day_enable = JSON.parse(req.body.day_enable);
      } catch (e) {

      }
      let enable_start_time = req.body.enable_start_time;
      let enable_end_time = req.body.enable_end_time;
      let address = req.body.address;

      let room = {
        user_id : user_id,
        device_id : device_id,
        title : title,
        detail : detail,
        type : type,
        tag : tag,
        day_enable : day_enable,
        enable_start_time : enable_start_time,
        enable_end_time : enable_end_time,
        room_images : room_images,
        address : address
      };
      console.log(room);
      Room.InsertRoom(room,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"공간 등록이 완료되었습니다.");
        }
      });

    }else{
      response.AuthFail(res);
      return;
    }
  });
});

/*
* 유저 공간(방) 수정하기
* PUT /api/user/room
*/
router.put('/:room_id',upload.array('add_image', 5),(req, res, next)=>{
  let add_image = [];
  for(let i=0,len = req.files.length; i< len;i++){
    add_image.push(req.files[i].filename);
  }

  User.CheckSession(req,(result, user)=>{
    if(result === true){
      let user_id = user.userid;
      let room_id = req.params.room_id;
      let device_id = req.body.device_id;
      let title = req.body.title;
      let detail = req.body.detail;
      let type = req.body.type;
      let tag = req.body.tag;
      let day_enable;
      try {
        day_enable = JSON.parse(req.body.day_enable);
      } catch (e) {
      }
      let enable_start_time = req.body.enable_start_time;
      let enable_end_time = req.body.enable_end_time;
      let address = req.body.address;
      let add_images = add_image;
      let delete_images;
      try{
        delete_images = JSON.parse(req.body.delete_images);
      }catch(e){
      }
      let room = {
        user_id : user_id,
        room_id : room_id,
        device_id : device_id,
        title : title,
        detail : detail,
        type : type,
        tag : tag,
        day_enable : day_enable,
        enable_start_time : enable_start_time,
        enable_end_time : enable_end_time,
        add_images : add_image,
        delete_images : delete_images,
        address : address
      };

      Room.UpdateRoom(room,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"방 수정이 완료되었습니다");
        }
      });
      return;
    }else{
      response.AuthFail(res);
      return;
    }
  });
});

/*
* 유저 공간(방) 삭제
* DELETE /api/user/room/:room_id
*/
router.delete('/:room_id',(req,res, next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result == true){
      Room.RemoveRoom(user.userid,req.params.room_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,'공간이 삭제되었습니다.');
        }
      });
    }else{
      response.AuthFail(res);
      return;
    }
  });
});

module.exports = router;
