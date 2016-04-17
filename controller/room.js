var Room = models.Room;
var enumType = ['숙박','회의실','공부방','창고','강당'];
var enumTag = ['선릉역','신림역','길음역','강남역','역삼역','왕십리역'];

module.exports = {
  'InsertRoom' : function(room, callback){
    callback = callback || function(){};
    var user_id = room.user_id;
    var device_id = room.device_id;
    var title = room.title;
    var detail = room.detail;
    var type = room.type;
    var tag = room.tag;
    var day_enable = room.day_enable;
    var enable_start_time = room.enable_start_time;
    var enable_end_time = room.enable_end_time;
    var room_images = room.room_images;
    var address = room.address;

    if( !user_id || !device_id || !title || !detail || !type || !tag || !room_images || !address || enumType.indexOf(type) == -1 || enumTag.indexOf(tag) == -1){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }
    if( type == '숙박' ){
       day_enable = ['월','화','수','목','금','토','일'];
       enable_start_time = "00:00";
       enable_end_time = "00:00";
    }

    if( type != '숙박' && ( !day_enable || !enable_start_time || !enable_end_time || enable_start_time > enable_end_time)){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }

    Room.findOne({ device_id : device_id}).then(function(doc){
      if(doc === null){
        return new Room({
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
          address : address}).save().then(function(doc){
            callback(null,doc);
          });
      }else{
        callback("중복된 디바이스 아이디 입니다.",null);
      }
    });
  },
  'UpdateRoom' : function(room, callback) {
    callback = callback || function(){};
    var room_id = room.room_id;
    var user_id = room.user_id;
    var add_images = room.add_images || [];
    var delete_images = room.delete_images || [];

    if( !room_id, !user_id ){
      callback("데이터 정보를 확인해주세요",null);
      return;
    }

    Room.findOne({ _id : room_id, user_id : user_id }).then(function(doc){
      if( doc === null){
        callback("방 정보가 존재하지 않습니다.",null);
      }else{
        var device_id = room.device_id || doc.device_id;
        var title = room.title || doc.title;
        var detail = room.detail || doc.detail;
        var type = room.type || doc.type;
        var tag = room.tag || doc.tag;
        var day_enable = room.day_enable || doc.day_enable;
        var enable_start_time = room.enable_start_time || doc.enable_start_time;
        var enable_end_time = room.enable_end_time || doc.enable_end_time;
        var address = room.address || doc.address;

        if( type == '숙박' ){
           day_enable = ['월','화','수','목','금','토','일'];
           enable_start_time = "00:00";
           enable_end_time = "00:00";
        }

        if(enumType.indexOf(type) == -1 || enumTag.indexOf(tag) == -1){
          callback("데이터 정보를 확인해주세요",null);
        }

        var room_images = doc.room_images;
        for(var i =0; i<delete_images.length;i++){
          if( room_images.indexOf(delete_images[i] != -1)){
            room_images.splice(i,1);
          }
        }

        for(var j=0; j<add_images.length;j++){
          room_images.push(add_images[j]);
        }

        Room.update({ _id : room_id, user_id : user_id},{
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
        },callback);
      }
    }).catch(function(err) {
      callback(err,null);
    });
  },
  'RemoveRoom' : function(room_id, callback) {
    callback = callback || function(){};
    Room.find({ _id : room_id }).remove().exec(callback);
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
    Room.find({ user_id : user_id }).skip(offset).limit(limi22t)
        .exec(callback);
  },
  'GetRoomByRoomId' : function(room_id,callback){
    callback = callback || function(){};
    Room.findOneAndUpdate({ _id : room_id },{ $inc : { view_count : 1 }},callback);
  },
  'GetRoomsByTag' : function(tag,offset,limit,sort,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    sort = sort || {};
    Room.find({ tag : tag }).sort(sort).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByType' : function(type,offset,limit,sort,callback) {
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    sort = sort || {};
    Room.find({ type : type }).sort(sort).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByView' : function(offset,limit,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    Room.find({}).sort({ view_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByReservation' : function(offset,limit,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    Room.find({}).sort({ reservation_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByFavorite' : function(offset,limit,callback){
    callback = callback || function(){};
    offset = offset || 0;
    limit = limit || 30;
    Room.find({}).sort({ favorite_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'IncrementFavorites' : function(room_id, callback){
    callback = callback || function(){};
    Room.findOneAndUpdate({ _id : room_id },{ $inc : { favorite_count : 1 }},callback);
  },
  'DecrementFavorites' : function(room_id, callback){
    callback = callback || function(){};
    Room.findOneAndUpdate({ _id : room_id },{ $dec : { favorite_count : 1 }},callback);
  }
};
