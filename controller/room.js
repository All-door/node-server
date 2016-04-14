var Room = models.Room;
var enumType = ['숙박','회의실','공부방','창고','강당'];
var enumTag = ['선릉역','신림역','길음역','강남역','역삼역','왕십리역'];

module.exports = {
  'InsertRoom' : function(user_id, device_id, title, detail, type, tag, day_enable, enable_start_time, enable_end_time, room_images, address,callback){
    callback = callback || function(){};

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
      if(doc == null){
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
    })
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
  'IncrementFavorites' : function(callback){
    callback = callback || function(){};
  },
  'DecrementFavorites' : function(callback){
    callback = callback || function(){};
  }
};
