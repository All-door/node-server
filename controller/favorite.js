'use strict'
const User = models.User;
const Room = models.Room;

module.exports = {
  'AddFavorites' : (user_id,room_id,callback)=>{
    callback = callback || ()=>{};

    if(!user_id ||
       !room_id){
         callback("입력 데이터를 확인해주세요",null);
         return;
     }
    Room
    .findOne({ _id : room_id })
    .then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다.",null);
      }else{
        User
        .findOne({ _id : user_id})
        .select({ _id : 0, favorite_rooms : 1 })
        .then((doc)=>{
          let favorite_rooms = doc.favorite_rooms;
          if( favorite_rooms.indexOf(room_id) == -1){
            favorite_rooms.push(room_id);
            Room
            .findOneAndUpdate({ _id : room_id},{ $inc : { favorite_count : 1}})
            .then(()=>{
              User
              .update({ _id : user_id },{ favorite_rooms : favorite_rooms})
              .exec((callback));
              });
            }else{
              callback("이미 관심목록이 존재하는 방입니다.",null);
            }
          });
      }
    });
  },
  'GetFavorites' : (offset,limit,user_id,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;
    
    if(!user_id){
      callback("입력 데이터를 확인해주세요",null);
      return;
    }

    User
    .findOne({ _id : user_id})
    .select({ _id : 0, favorite_rooms : 1 })
    .skip(offset)
    .limit(limit)
    .then((doc)=>{
      callback(null,doc.favorite_rooms)
    });
  },
  'RemoveFavorite' : (user_id,room_id,callback)=>{
    callback = callback || ()=>{};

    if(!user_id ||
       !room_id){
         callback("입력 데이터를 확인해주세요.",null);
       }

    User
    .findOne({ _id : user_id})
    .select({ _id : 0, favorite_rooms : 1 })
    .then((doc)=>{
      let favorite_rooms = doc.favorite_rooms;
      if(favorite_rooms.indexOf(room_id) == -1){
        callback("존재하지 않는 관심 방 정보입니다.",null);
      }else{
        favorite_rooms.splice(room_id,1);
        Room
        .findOneAndUpdate({ _id : room_id},{ $inc : { favorite_count : -1}})
        .then(()=>{
          User
          .update({ _id : user_id},{ favorite_rooms : favorite_rooms})
          .exec(callback);
        }).catch((e)=>{
          console.log(e);
        });
      }
    });
  }
}
