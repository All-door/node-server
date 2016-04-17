var express = require('express');
var router = express.Router();
var Room = require('../../controller/room');

router.get('/', function(req, res, next) {
  Room.GetRooms(req.query.offset,req.query.limit,function(err,docs){
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

router.get('/sort/view', function(req,res,next){
  Room.GetRoomsByView(req.query.offset,req.query.limit,function(err,doc){
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

router.get('/sort/reservation', function(req,res,next){
  Room.GetRoomsByReservation(req.query.offset,req.query.limit,function(err,doc){
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

router.get('/sort/favorite', function(req,res,next){
  Room.GetRoomsByFavorite(req.query.offset,req.query.limit,function(err,doc){
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

router.get('/tag/:tag', function(req,res,next){
  var tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{},function(err,doc){
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

router.get('/tag/:tag/sort/view', function(req,res,next){
  var tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ view_count : -1},function(err,doc){
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

router.get('/tag/:tag/sort/reservation', function(req,res,next){
  var tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ reservation_count : -1},function(err,doc){
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

router.get('/tag/:tag/sort/favorite', function(req,res,next){
  var tag = req.params.tag;
  Room.GetRoomsByTag(tag,req.query.offset,req.query.limit,{ favorite_count : -1},function(err,doc){
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

router.get('/type/:type', function(req,res,next){
  var type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{},function(err,doc){
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

router.get('/type/:type/sort/view', function(req,res,next){
  var type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ view_count : -1 },function(err,doc){
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

router.get('/type/:type/sort/favorite', function(req,res,next){
  var type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ favorite_count : -1 },function(err,doc){
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

router.get('/type/:type/sort/reservation', function(req,res,next){
  var type = req.params.type;
  Room.GetRoomsByType(type,req.query.offset,req.query.limit,{ reservation_count : -1 },function(err,doc){
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
