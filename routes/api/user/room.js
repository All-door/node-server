var express = require('express');
var router = express.Router();
var Room = require('../../../controller/room');
var User = require('../../../controller/user');
var config = require('../../../config');
var upload = require('../../../controller/multer');!

/*
* /api/user/room
*/

router.get('/',function(req, res, next) {
  User.CheckSession(req, function(result,user){
    if(result == true){
      Room.GetRoomsByUserId(user.userid,req.query.offset,req.query.limit,function(err,docs){
        if(err){
          res.json({
            "status" : 500,
            "message" : err
          }).status(500);
        }else{
          res.json({
            "status": 200,
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

router.post('/',upload.array('room_image', 5),function(req, res, next) {
  var room_images = [];
  for(var i=0; i< req.files.length;i++){
    room_images.push(req.files[i].filename);
  }

  User.CheckSession(req,function(result, user){
    if(result === true){
      var user_id = user.userid;
      var device_id = req.body.device_id;
      var title = req.body.title;
      var detail = req.body.detail;
      var type = req.body.type;
      var tag = req.body.tag;
      var day_enable;
      try {
        day_enable = JSON.parse(req.body.day_enable);
      } catch (e) {

      }
      var enable_start_time = req.body.enable_start_time;
      var enable_end_time = req.body.enable_end_time;
      var address = req.body.address;

      var room = {
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

      Room.InsertRoom(room,function(err,doc) {
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "message" : "공간 등록이 완료되었습니다"
          }).status(200);
        }
      });

    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
      return;
    }
  });
});

router.put('/:room_id',upload.array('add_image', 5),function(req, res, next) {
  var add_image = [];
  for(var i=0; i< req.files.length;i++){
    add_image.push(req.files[i].filename);
  }

  User.CheckSession(req,function(result, user){
    if(result === true){
      var user_id = user.userid;
      var room_id = req.params.room_id;
      var device_id = req.body.device_id;
      var title = req.body.title;
      var detail = req.body.detail;
      var type = req.body.type;
      var tag = req.body.tag;
      var day_enable;
      try {
        day_enable = JSON.parse(req.body.day_enable);
      } catch (e) {
      }
      var enable_start_time = req.body.enable_start_time;
      var enable_end_time = req.body.enable_end_time;
      var address = req.body.address;
      var add_images = add_image;
      var delete_images;
      try{
        delete_images = JSON.parse(req.body.delete_images);
      }catch(e){
      }
      var room = {
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

      Room.UpdateRoom(room,function(err,doc){
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "message" : doc
          }).status(200);
        }
      });
      return;
    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
      return;
    }
  });
});

router.delete('/:room_id',function(req,res, next){
  User.CheckSession(req,function(result,user) {
    if(result == true){
      Room.RemoveRoom(user.userid,req.params.room_id,function(err,doc){
        if(err){
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          res.json({
            "status" : 200,
            "message" : "공간이 삭제되었습니다."
          });
        }
      });
    }else{
      res.json({
        "status" : 401,
        "message" : "인증되지 않은 접근입니다."
      }).status(401);
      return;
    }
  });
});

module.exports = router;
