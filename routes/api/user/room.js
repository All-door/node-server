var express = require('express');
var router = express.Router();
var Room = require('../../../controller/room');
var User = require('../../../controller/user');
var config = require('../../../config');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.ImagePath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
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
  console.log(req.files);
  User.CheckSession(req,function(result, user){
    if(result == true){
      if(!req.body.title || !req.body.detail || !req.body.type ||
      !req.body.tag || !req.body.day_enable){
        res.json({
          "status" : 400,
          "message" : "입력 데이터를 확인해주세요"
        }).status(400);
      }
      var room = {
        user_id : user.userid,
        device_id : req.body.device_id,
        title : req.body.title,
        detail : req.body.detail,
        type : req.body.type,
        tag : req.body.tag,
        day_enable : JSON.parse(req.body.day_enable)
      };

      console.log(room);

      Room.InsertRoom(room,function(err,doc) {
        if(err){
          console.log(err);
          res.json({
            "status" : 400,
            "message" : err
          }).status(400);
        }else{
          console.log(doc);
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
    }
  });
});

router.put('/',function(req, res, next) {

});

router.get('/:id',function(req, res, next){

});

module.exports = router;
