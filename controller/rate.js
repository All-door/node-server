'use strict'
const User = models.User;
const Room = models.Room;

module.exports = {
  'GetRoomRate' : (room_id,callback)=>{
    callback = callback || ()=>{};
    if( !room_id){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }

    Room
    .findOne({ _id : room_id})
    .then((doc)=>{
      if(doc == null){
        callback("공간 정보가 존재하지 않습니다.",null);
      }else{
        let rates = doc.rates || [];
        let total = 0;

        if( rates.length !== 0 ){
          for(let i=0,len=rates.length;i<len;i++){
            total += rates[i].rate;
          }
          total = total/rates.length;
        }

        callback(null,total);
      }
    })
  },
  'InsertRoomRate' : (user_id,room_id,rate,callback)=>{
    callback = callback || ()=>{};

    console.log(user_id);
    console.log(room_id);
    console.log(rate);
    console.log(typeof(rate) === 'number');
    if( !user_id || !room_id || !rate || !(typeof(rate) === 'number') || rate < 1 || rate > 5){
      callback("입력 데이터를 확인해주세요",null);
      return;
    }

    Room
    .findOne({ _id : room_id })
    .then((doc)=>{
      if(doc == null){
        callback("공간 정보가 존재하지 않습니다",null);
      }else{
        let rates = doc.rates;

        let check = false;
        for(let i=0,len=rates.length;i<len;i++){
          if( rates[i].user_id === user_id){
            rates[i].rate = rate;
            check = true;
            break;
          }
        }
        if( check === false){
          rates.push({
            user_id : user_id,
            rate : rate
          });
        }

        let now = new Date();
        Room
        .update({ _id : room_id },{ rates : rates, updatedAt : now })
        .exec(callback);
      }
    });
  }
};
