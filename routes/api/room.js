var express = require('express');
var router = express.Router();
var Room = require('../../controller/room');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:room_id', function(req,res,next){
  var room_id = req.params.room_id;
  Room.GetRoomByRoomId(room_id,function(err,doc){
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
