var express = require('express');
var router = express.Router();
var Room = require('../../../controller/room');
var User = require('../../../controller/user');
var config = require('../../../config');
var multer = require('multer');
var shortid = require('shortid');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.ImagePath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-'+ shortid() + '-' + Date.now())
  }
});
var upload = multer({ storage : storage });

/*
* /api/user/room
*/

router.get('/',function(req, res, next) {
  res.send("room");
});

router.post('/',upload.array('room_image', 5),function(req, res, next) {
  var files = [];
  for(var i=0; i< req.files.length;i++){
    files.push(req.files[i].filename);
  }

  User.CheckSession(req,function(result, user){
    if(result == true){
      if(!req.body.title || !req.body.detail || !req.body.type ||
      !req.body.tag || !req.body.day_enable || !files.length){
        res.json({
          "status" : 400,
          "message" : "입력 데이터를 확인해주세요"
        }).status(400);
        return;
      }
      var room = {
        user_id : user.userid,
        device_id : req.body.device_id,
        title : req.body.title,
        detail : req.body.detail,
        type : req.body.type,
        tag : req.body.tag,
        day_enable : JSON.parse(req.body.day_enable),
        enable_start_time : req.body.enable_start_time,
        enable_end_time : req.body.enable_end_time,
        room_images : files
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

router.put('/',function(req, res, next) {

});

router.get('/:id',function(req, res, next){

});

module.exports = router;
