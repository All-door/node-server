var Room = models.Room;

module.exports = {
  'InsertRoom' : function(room,callback){
    var _room = room;
    callback = callback || function(){};

    if(!room.title || !room.detail || !room.type
    || !room.tag || !room.day_enable){
      callback("데이터 정보를 확인해주세요",null);
      return;
    }

    if( room.type != '숙박' &&
    (!room.enable_start_time || !room.enable_end_time)){
      callback("가능한 시작시간과 종료시간을 입력주세요",null);
      return;
    }
    Room.findOne({ device_id : room.device_id },function(err,doc){
      if(doc == null){
        var data = new Room({
          user_id : _room.user_id,
          device_id : _room.device_id,
          title : _room.title,
          detail : _room.detail,
          type : _room.type,
          tag : _room.tag,
          day_enable : _room.day_enable || ['월','화','수','목','금','토','일'],
          enable_start_time : _room.enable_start_time || "00:00",
          enable_end_time : _room.enable_end_time || "00:00",
          room_images : _room.room_images
        });

        data.save(function(err,doc){
          if(err){
            callback(err.errors,null);
          }else{
            callback(null,doc);
          }
        });
      }else{
        callback("이미 등록된 디바이스입니다.",null);
      }
    });
  },
  'UpdateRoom' : function(callback) {
    callback = callback || function(){};
  },
  'RemoveRoom' : function(callback) {
    callback = callback || function(){};
  },
  'GetRooms' : function(offset,limit,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;

    Room.find({}).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByUserId' : function(user_id,offset,limit, callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    Room.find({ user_id : user_id }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomByRoomId' : function(room_id,callback){
    callback = callback || function(){};
    Room.findOne({ _id : room_id }, callback);
  },
  'GetRoomsByTag' : function(tag,offset,limit,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    Room.find({ tag : tag }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByView' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByReservation' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByFavorite' : function(callback){
    callback = callback || function(){};
  },
  'IncrementView' : function(callback){q
    callback = callback || function(){};
  },
  'IncrementFavorites' : function(callback){
    callback = callback || function(){};
  },
  'DecrementFavorites' : function(callback){
    callback = callback || function(){};
  }
};
