var Room = models.Room;

module.exports = {
  'InsertRoom' : function(room,callback){
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
    var room = new Room({
      user_id : room.user_id,
      device_id : room.device_id,
      title : room.title,
      detail : room.detail,
      type : room.type,
      tag : room.tag,
      day_enable : room.day_enable || ['월','화','수','목','금','토','일'],
      enable_start_time : room.enable_start_time || "00:00",
      enable_end_time : room.enable_end_time || "00:00",
      room_images : room.room_images
    });

    room.save(function(err,doc){
      if(err){
        callback(err.errors,null);
      }else{
        callback(null,doc);
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
  },
  'GetRoomsByUserId' : function(userid, callback){
    callback = callback || function(){};
  },
  'GetRoomByRoomId' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByTag' : function(callback){
    callback = callback || function(){};
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
  'IncrementView' : function(callback){
    callback = callback || function(){};
  },
  'IncrementFavorites' : function(callback){
    callback = callback || function(){};
  },
  'DecrementFavorites' : function(callback){
    callback = callback || function(){};
  }
};
