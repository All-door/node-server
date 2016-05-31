'use strict'
const Room = models.Room;
const Reservation = models.Reservation;
const async = require('async');
const dayList = ['일','월','화','수','목','금','토','일'];
const enumType = ['숙박','회의실','공부방','창고','강당'];
const enumTag = ['선릉역','신림역','길음역','강남역','역삼역','왕십리역'];

module.exports = {
  'InsertRoom' : (room, callback)=>{
    callback = callback || ()=>{};
    let user_id = room.user_id;
    let device_id = room.device_id;
    let title = room.title;
    let detail = room.detail;
    let type = room.type;
    let tag = room.tag;
    let day_enable = room.day_enable;
    let enable_start_time = room.enable_start_time;
    let enable_end_time = room.enable_end_time;
    let room_images = room.room_images;
    let address = room.address;
    let price = room.price;
    let capacity = room.capacity;

    if( !price || !capacity || !user_id || !device_id || !title || !detail || !type || !tag || !room_images || !address || enumType.indexOf(type) == -1 || enumTag.indexOf(tag) == -1){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }
    if( type == '숙박' ){
       day_enable = ['월','화','수','목','금','토','일'];
       enable_start_time = "24:00";
       enable_end_time = "24:00";
    }

    if( type != '숙박' && ( !day_enable || !enable_start_time || !enable_end_time || enable_start_time > enable_end_time)){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }

    Room.findOne({ device_id : device_id}).then((doc)=>{
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
          address : address,
          price : price,
          capacity : capacity}).save().then((doc)=>{
            callback(null,doc);
          });
      }else{
        callback("중복된 디바이스 아이디 입니다.",null);
      }
    });
  },
  'UpdateRoom' : (room, callback)=>{
    callback = callback || ()=>{};
    let room_id = room.room_id;
    let user_id = room.user_id;
    let add_images = room.add_images || [];
    let delete_images = room.delete_images || [];

    if( !room_id, !user_id ){
      callback("데이터 정보를 확인해주세요",null);
      return;
    }

    Room.findOne({ _id : room_id, user_id : user_id }).then((doc)=>{
      if( doc === null){
        callback("방 정보가 존재하지 않습니다.",null);
      }else{
        let device_id = room.device_id || doc.device_id;
        let title = room.title || doc.title;
        let detail = room.detail || doc.detail;
        let type = room.type || doc.type;
        let tag = room.tag || doc.tag;
        let day_enable = room.day_enable || doc.day_enable;
        let enable_start_time = room.enable_start_time || doc.enable_start_time;
        let enable_end_time = room.enable_end_time || doc.enable_end_time;
        let address = room.address || doc.address;
        let price = room.price || doc.price;
        let capacity = room.capacity || doc.capacity;

        if( type == '숙박' ){
           day_enable = ['월','화','수','목','금','토','일'];
           enable_start_time = "00:00";
           enable_end_time = "00:00";
        }

        if(enumType.indexOf(type) == -1 || enumTag.indexOf(tag) == -1){
          callback("데이터 정보를 확인해주세요",null);
        }

        let room_images = doc.room_images;

        for(let i = 0,len=delete_images.length; i<len;i++){
          if( room_images.indexOf(delete_images[i]) != -1 ){
            room_images.splice(i,1);
          }
        }

        for(let i=0,len = add_images.length; i<len;i++){
          room_images.push(add_images[i]);
        }

        let now = new Date();
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
          address : address,
          price : price,
          capacity : capacity,
          updatedAt : now
        },callback);
      }
    }).catch((err)=>{
      callback(err.message,null);
    });
  },
  'RemoveRoom' : (user_id,room_id,callback)=>{
    callback = callback || ()=>{};
    Room.findOne({ _id : room_id, user_id : user_id}).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다",null);
      }else{
        Room.findOne({ _id : room_id, user_id : user_id}).remove().exec(callback);
      }
    });
  },
  'GetRooms' : (offset,limit,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    Room.find({}).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByUserId' : (user_id,offset,limit, callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    Room.find({ user_id : user_id }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomByRoomId' : (room_id,callback)=>{
    callback = callback || ()=>{};
    Room.findOneAndUpdate({ _id : room_id },{ $inc : { view_count : 1 }},callback);
  },
  'GetRoomsByTag' : (tag,offset,limit,sort,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    sort = sort || {};
    Room.find({ tag : tag }).sort(sort).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByType' : (type,offset,limit,sort,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    sort = sort || {};
    Room.find({ type : type }).sort(sort).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByView' : (offset,limit,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    Room.find({}).sort({ view_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByReservation' : (offset,limit,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    Room.find({}).sort({ reservation_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetRoomsByFavorite' : (offset,limit,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    Room.find({}).sort({ favorite_count : -1 }).skip(offset).limit(limit)
        .exec(callback);
  },
  'GetVancancyRoomsByQuery' : (offset,limit,query,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    let type = query.type;
    let tag = query.tag;
    let capacity = query.capacity;
    let start_day = query.start_day;
    let start_time = query.start_time;
    let end_day = query.end_day;
    let end_time = query.end_time;

    if( !tag && !type ){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }

    if((type != '숙박' && !start_day && !end_day)){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }

    if((type == '숙박' && (!start_day && end_day))){
      callback('데이터 정보를 확인해주세요.',null);
      return;
    }

    if(type != '숙박'){
      end_day = start_day;
    }

    if( type != '숙박' && (!start_time || !end_time)){
      callback("데이터 정보를 확인해주세요.",null);
      return;
    }

    if( type == '숙박' ){
      start_time = '24:00';
      end_time = '24:00';
    }

    let find_query = {};

    if( capacity ){
      find_query.capacity = { $gte : capacity };
    }
    if(type && tag){
      find_query.type = type;
      find_query.tag = tag;
    }
    else if(type){
      find_query.type = type;
    }
    else if(tag){
      find_query.tag = tag;
    }

    Room
    .find(find_query)
    .then((docs)=>{
      if(docs.length == 0){
        callback(null,[]);
      }else{
        let list = [];
        async.filter(docs,(doc,callback)=>{
          if( type == '숙박'){
            Reservation.find({ room_id : doc._id })
                       .then((docs)=>{
                         let reservations = docs.filter((doc)=>{
                             if( start_day >= doc.start_day && start_day <= doc.end_day){
                               return true;
                             }
                             if( end_day > doc.start_day && end_day <= doc.end_day){
                               return true;
                             }
                             if(start_day <= doc.start_day && end_day >= doc.end_day){
                               return true;
                             }
                             if(start_day >= doc.start_time && end_day <= doc.end_day){
                               return true;
                             }
                             return false;
                         });
                         if( reservations.length == 0){
                           if(offset == 0 && limit > 0){
                             list.push(doc);
                             limit --;
                           }
                           if( offset > 0){
                             offseet --;
                           }
                           callback(null,doc);
                         }else{
                           callback(null,null);
                         }
                       });
          }else{
            Reservation.findOne({ room_id : doc._id })
                       .where('start_day').equals(start_day)
                       .where('start_time').lte(end_time).gte(start_time)
                       .where('end_time').lte(end_time).gte(start_time)
                       .then((result)=>{
                         if( result == null){
                           let day = dayList[new Date(start_day).getDay()];

                           if(doc.day_enable.indexOf(day) == -1 || start_time < doc.enable_start_time || end_time > doc.enable_end_time){
                             callback(null,doc);
                           }
                           else{
                             if(offset == 0 && limit > 0){
                               list.push(doc);
                               limit--;
                             }
                             if(offset > 0){
                               offset--;
                             }
                             callback(null,doc);
                           }
                         }else{
                           callback(null,null);
                         }
                       });
          }
        },(err,results)=>{
          callback(null,list);
        });
      }
    });
  }
};
