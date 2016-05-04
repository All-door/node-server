'use strict'
const Reservation = models.Reservation;
const Room = models.Room;
const GetTodayDateString = ()=>{
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = (month > 9)? month : '0' + month;
  let date = now.getDate();
  date = (date > 9)? date : '0' + date;
  return year + '-' + month + '-' + date;
};

const GetTodayTimeString = ()=>{
  const now = new Date();
  let hour = now.getHours();
  hour = (hour > 9) ? hour : '0' + hour;
  let mintues = now.getMinutes();
  mintues = (mintues > 9) ? mintues : '0' + mintues;
  return hour + ":00";
};

const GetTodayDayString = (date)=>{
  const now = new Date(date);
  const week = ['일','월','화','수','목','금','토','일'];
  return week[now.getDay()];
};

module.exports = {
  'ReserveRoom' : (reservation,callback)=>{
    callback = callback || ()=>{};

    let user_id = reservation.user_id;
    let room_id = reservation.room_id;
    let start_day = reservation.start_day;
    let start_time = reservation.start_time;
    let end_day = reservation.end_day;
    let end_time = reservation.end_time;
    let password = reservation.password;

    if( !user_id ||
        !room_id ||
        !password ){
          callback("데이터 정보를 확인해주세요",null);
          return;
        }

    Room.findOne({ _id : room_id}).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다.",null);
      }else{
        let type = doc.type;
        let enable_start_time = doc.enable_start_time;
        let enable_end_time = doc.enable_end_time;
        let day_enable = doc.day_enable;

        if( type === '숙박'){
          start_time = '24:00';
          end_time = '24:00';
          reservation.start_time = '24:00';
          reservation.end_time = '24:00';
        }else{
          let date = GetTodayDateString();
          let time = GetTodayTimeString();

          if( start_time > end_time ||
              start_day > end_day ||
              start_day < date ||
              end_day < date ||
              (start_day === date &&
               start_time < time)){
                callback("시간 정보를 확인해주세요.",null);
                return;
          }

          if( start_time < enable_start_time ||
              end_time > enable_end_time ||
              day_enable.indexOf(GetTodayDayString(start_day)) === -1 ||
              day_enable.indexOf(GetTodayDayString(end_day)) === -1){
                callback("예약 가능한 시간/요일이 아닙니다.",null);
                return;
              }
        }

        Reservation.findOne({ room_id : room_id })
                   .where('start_day').lte(end_day).gte(start_day)
                   .where('start_time').lte(end_time).gte(start_time)
                   .where('end_day').lte(end_day).gte(start_day)
                   .where('end_time').lte(end_time).gte(start_time)
                   .then((doc)=>{
                     if( doc != null){
                       callback("기존의 예약 시간과 겹칩니다.",null);
                     }else{
                       Room
                       .findOneAndUpdate({ _id : room_id },{ $inc : { reservation_count : 1 }})
                       .then((doc)=>{
                         console.log(doc);
                         reservation.status = '예약완료';
                         return new Reservation(reservation).save();
                       }).then((doc)=>{
                         callback(null,doc);
                       });
                     }
                   });
      }
    });
  },
  'UpdateReservation' : (reservation,callback)=>{
    callback = callback || ()=>{};

    let reservation_id = reservation.reservation_id;
    let user_id = reservation.user_id;
    let password = reservation.password;

    Reservation.findOne({ _id : reservation_id, user_id : user_id}).then((doc)=>{
      if(doc == null){
        callback("예약 정보가 존재하지 않습니다.",null);
      }else{
        let now = new Date();
        Reservation.update({ _id : reservation_id, user_id : user_id},{ password : password, updatedAt : now}).exec(callback);
      }
    });
  },
  'RemoveReservation' : (user_id,reservation_id,callback)=>{
    callback = callback || ()=>{};

    Reservation.findOne({ _id : reservation_id, user_id : user_id}).then((doc)=>{
      if(doc == null){
        callback("예약 정보가 존재하지 않습니다.",null);
      }else{
        Room
        .findOneAndUpdate({ _id : doc.room_id },{ $inc : { reservation_count : -1 }})
        .then((doc)=>{
          Reservation
          .findOne({ _id : reservation_id, user_id : user_id})
          .remove()
          .exec(callback);
        });
      }
    });
  },
  'GetResevationByUserId' : (offset,limit,user_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    let today = GetTodayDateString();
    let time = GetTodayTimeString();

    Reservation.find({ user_id : user_id})
               .where('end_day').gte(today)
               .select({ password : 0 , user_id : 0})
               .sort({ start_day : - 1})
               .skip(offset)
               .limit(limit)
               .exec(callback)
  },
  'GetOldResevationByUserId' : (offset,limit,user_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    let today = GetTodayDateString();
    let time = GetTodayTimeString();

    Reservation.find({ user_id : user_id })
               .where('end_day').lt(today)
               .select({ password : 0, user_id : 0})
               .sort({ end_day : -1 })
               .skip(offset)
               .limit(limit)
               .exec(callback)
  },
  'GetReservationByRoomId' : (offset,limit,room_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    let today = GetTodayDateString();

    Room.findOne({ _id : room_id }).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다",null);
      }else{
        Reservation.find({ room_id : room_id })
                   .where('end_day').gte(today)
                   .where('status').in(['예약중','예약완료'])
                   .sort({ start_day : -1 })
                   .skip(offset)
                   .limit(limit)
                   .select({ start_day : 1, start_time : 1, end_day : 1, end_time : 1 })
                   .then((docs)=>{
                     callback(null,docs);
                   })
      }
    });
  },
  'GetReservationByReservationId' : (user_id,reservation_id,callback)=>{
    callback = callback || ()=>{};

    Reservation.findOne({ _id : reservation_id, user_id : user_id })
               .then((doc)=>{
                 if(doc == null){
                   callback("존재하지 않는 예약정보입니다",null);
                 }else{
                   callback(null,doc);
                 }
               });
  }
};
