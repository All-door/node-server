'use strict';
const Reservation = models.Reservation;
const PreReservation = models.PreReservation;
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

const GetDateDifference = (start_day, end_day)=>{
  const date1 = new Date(start_day);
  const date2 = new Date(end_day);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays + 1;
};

const GetHourDifference = (start_time, end_time)=>{
  const date1 = new Date("2015/01/01 " + start_time);
  const date2 = new Date("2015/01/01 " + end_time);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffHour = Math.ceil(timeDiff / (1000 * 3600));
  return diffHour;
};

module.exports = {
  'ReserveRoom' : (reservation,callback)=>{
    callback = callback || ()=>{};

    let title = reservation.title;
    let user_id = reservation.user_id;
    let room_id = reservation.room_id;
    let start_day = reservation.start_day;
    let start_time = reservation.start_time;
    let end_day = reservation.end_day;
    let end_time = reservation.end_time;
    let password = reservation.password;

    if( !title || !user_id || !room_id || !password ){
        callback("데이터 정보를 확인해주세요",null);
        return;
    }

    Room.findOne({ _id : room_id}).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다.",null);
      }else{
        let type = doc.type;
        let price = doc.price ? doc.price : 0;
        reservation.room_title = doc.title;
        reservation.room_type = doc.type;
        reservation.address = doc.address;

        if( type === '숙박'){
          start_time = '24:00';
          end_time = '24:00';
          reservation.start_time = '24:00';
          reservation.end_time = '24:00';
          reservation.totalPrice = GetDateDifference(start_day,end_day) * price;
        }else{
          let enable_start_time = doc.enable_start_time;
          let enable_end_time = doc.enable_end_time;
          let day_enable = doc.day_enable;
          let date = GetTodayDateString();
          let time = GetTodayTimeString();

          if( start_time > end_time || start_day > end_day || start_day < date || end_day < date || (start_day === date && start_time < time)){
              callback("시간 정보를 확인해주세요.",null);
              return;
          }

          if( start_time < enable_start_time || end_time > enable_end_time ||
              day_enable.indexOf(GetTodayDayString(start_day)) === -1 ||
              day_enable.indexOf(GetTodayDayString(end_day)) === -1){
              callback("예약 가능한 시간/요일이 아닙니다.",null);
              return;
          }
          reservation.totalPrice = GetHourDifference(start_time,end_time) * price;
        }

        Reservation
        .findOne({ room_id : room_id })
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
              return new Reservation(reservation).save();
            }).then((doc)=>{
              callback(null,doc);
            });
          }
        });
      }
    });
  },
  'PreReserveRoom' : (reservation,callback)=>{
    let user_id = reservation.user_id;
    let room_id = reservation.room_id;
    let start_day = reservation.start_day;
    let end_day = reservation.end_day;
    let start_time = reservation.start_time;
    let end_time = reservation.end_time;

    if( !user_id || !room_id ){
        callback("데이터 정보를 확인해주세요",null);
        return;
    }

    Room.findOne({ _id : room_id}).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다.",null);
      }else{
        let type = doc.type;
        if( type === '숙박'){
          start_time = '24:00';
          end_time = '24:00';
          reservation.start_time = '24:00';
          reservation.end_time = '24:00';
        }else{
          end_day = start_day;
          reservation.end_day = start_day;
          let enable_start_time = doc.enable_start_time;
          let enable_end_time = doc.enable_end_time;
          let day_enable = doc.day_enable;
          let date = GetTodayDateString();
          let time = GetTodayTimeString();

          if( start_time > end_time || start_day > end_day || start_day < date || end_day < date || (start_day === date && start_time < time)){
              callback("시간 정보를 확인해주세요.",null);
              return;
          }

          if( start_time < enable_start_time || end_time > enable_end_time ||
              day_enable.indexOf(GetTodayDayString(start_day)) === -1 ||
              day_enable.indexOf(GetTodayDayString(end_day)) === -1){
              callback("예약 가능한 시간/요일이 아닙니다.",null);
              return;
          }
        }

        Reservation
        .findOne({ room_id : room_id })
        .where('start_day').lte(end_day).gte(start_day)
        .where('start_time').lte(end_time).gte(start_time)
        .where('end_day').lte(end_day).gte(start_day)
        .where('end_time').lte(end_time).gte(start_time)
        .then((doc)=>{
          if( doc != null){
            callback("기존의 예약 시간과 겹칩니다.",null);
          }else{
            PreReservation
            .findOne({ room_id : room_id })
            .where('start_day').lte(end_day).gte(start_day)
            .where('start_time').lte(end_time).gte(start_time)
            .where('end_day').lte(end_day).gte(start_day)
            .where('end_time').lte(end_time).gte(start_time)
            .then((doc)=>{
              if( doc == null){
                return new PreReservation(reservation).save().then((doc)=>{
                  callback(null,doc);
                });
              }else{
                callback("기존의 예약 시간과 겹칩니다.",null);
              }
            })
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
        Reservation.update({ _id : reservation_id, user_id : user_id},{ password : password, updatedAt : now }).exec(callback);
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
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    let today = GetTodayDateString();
    Room.findOne({ _id : room_id }).then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 방입니다",null);
      }else{
        PreReservation
        .find({ room_id : room_id })
        .select({ start_time : 1, end_time : 1, start_day : 1, end_day : 1})
        .where('end_day').gte(today)
        .then((docs)=>{
          let pre_reservation = docs;
          Reservation
          .find({ room_id : room_id })
          .where('end_day').gte(today)
          .where('status').in(['예약중','예약완료'])
          .sort({ start_day : -1 })
          .select({ start_time : 1, end_time : 1, start_day : 1, end_day : 1 })
          .then((docs)=>{
            let result = docs.concat(pre_reservation);
            callback(null,result.slice(offset,offset+limit));
          })
        });
      }
    });
  },
  'GetReservationByReservationId' : (user_id,reservation_id,callback)=>{
    callback = callback || ()=>{};

    Reservation.findOne({ _id : reservation_id, user_id : user_id })
               .select({ password : 0, user_id : 0, status : 0, room_id : 0, _id : 0 })
               .then((doc)=>{
                 if(doc == null){
                   callback("존재하지 않는 예약정보입니다",null);
                 }else{
                   callback(null,doc);
                 }
               });
  },
  'GetReservationByRoomIdInAdmin' : (offset,limit,user_id,room_id,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    if( !user_id || !room_id ){
      callback('데이터 정보를 확인해주세요.',null);
      return;
    }

    Room.findOne({ _id : room_id })
    .then((doc)=>{
      if(doc == null){
        throw new Error('공간 정보가 존재하지 않습니다.');
      }else{
        if( doc.user_id == user_id){
          return Reservation
          .find({ room_id : room_id })
          .select({ password : 0 });
        }else{
          throw new Error('공간 접근 권한이 없습니다.');
        }
      }
    })
    .then((docs)=>{
      callback(null,docs.slice(offset,offset+limit));
    })
    .catch((e)=>{
      switch (e.message) {
        case '공간 접근 권한이 없습니다':
        case '공간 정보가 존재하지 않습니다.':
          callback(e.message,null);
          break;
        default:
          callback(String(e),null);
      }
    });
  },
  'RemoveReservationByReservationIdInAdmin' : (offset,limit,user_id,room_id,reservation_id,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    if( !user_id || !room_id || !reservation_id ){
      callback('데이터 정보를 확인해주세요.',null);
      return;
    }

    Room.findOne({ _id : room_id })
    .then((doc)=>{
      if( doc == null){
        throw new Error('공간 정보가 존재하지 않습니다.');
      }else{
        if( doc.user_id == user_id){
          return Reservation
          .findOne({ _id : reservation_id, room_id : room_id })
          .where('status').in(['예약 완료']);
        }else{
          throw new Error('공간 접근 권한이 없습니다.');
        }
      }
    })
    .then((doc)=>{
      if( doc == null){
        throw new Error('예약 정보가 존재하지 않습니다.')
      }else{
        return Reservation
        .update({ _id : reservation_id, room_id : room_id }, { status : '관리자 취소'})
      }
    })
    .then((doc)=>{
      console.log(doc);
      callback(null,doc);
    })
    .catch((e)=>{
      switch (e.message) {
        case '공간 접근 권한이 없습니다':
        case '공간 정보가 존재하지 않습니다.':
        case '예약 정보가 존재하지 않습니다.':
          callback(e.message,null);
          break;
        default:
          callback(String(e),null);
      }
    });
  }
};
