'use strict'

const Reservation = models.Reservation;
const DeviceLog = models.DeviceLog;
const Room = models.Room;
const User = models.User;

const FaceAPI = require('./faceapi.js')
const Redis = require('ioredis');
const redis = new Redis();
const sendSMS = require('./sms.js');
const PhoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;


const GetTodayTimeString = ()=>{
  const now = new Date();
  let hour = now.getHours();
  hour = (hour > 9) ? hour : '0' + hour;
  let mintues = now.getMinutes();
  mintues = (mintues > 9) ? mintues : '0' + mintues;
  return hour + ":" + mintues;
};

const GetTodayDateString = ()=>{
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = (month > 9)? month : '0' + month;
  let date = now.getDate();
  date = (date > 9)? date : '0' + date;
  return year + '-' + month + '-' + date;
};

module.exports={
  'GetDeviceStatus' : (user_id,device_id,callback)=>{
    callback = callback || ()=>{};

    if( !user_id || !device_id){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }

    redis
    .hget('device_info',device_id)
    .then((result)=>{
      if(result == null){
        callback("디바이스 상태 정보가 존재하지 않습니다.",null);
      }else{
        callback(null,JSON.parse(result));
      }
    });
  },
  'DeviceRoutine' : (device_id,battery_status,callback)=>{
    callback = callback || ()=>{};

    if(!device_id){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }

    Room
    .findOne({ device_id : device_id })
    .then((doc)=>{
      if(doc == null){
        callback("Device isn't registered",null);
      }else{
        let now = GetTodayTimeString();
        let today = GetTodayDateString();
        if( doc.type === '숙박'){
          Reservation
          .findOne({ room_id : doc._id })
          .where('status').equals('예약완료')
          .where("start_day").lte(today)
          .where("end_day").gte(today)
          .then((doc)=>{
            if(doc == null){
              callback(null,{ });
            }else{
              if( doc.face_id == null && doc.face_image_path != null ){
                FaceAPI.GetFaceIdByImage(doc.face_image_path, (err,faceId)=>{
                  Reservation.update({ _id : doc._id }, { face_id : faceId }, (err)=>{
                    callback(null,{ pw1 : doc.password, faceId : faceId });
                  });
                });
              }else{
                callback(null,{ pw1 : doc.password, faceId : doc.face_id });
              }
            }
          });
        }else{
          Reservation
          .findOne({ room_id : doc._id })
          .where('status').equals('예약완료')
          .where("start_day").lte(today)
          .where("end_day").gte(today)
          .where("start_time").lte(now)
          .where("end_time").gte(now)
          .then((doc)=>{
            if(doc == null){
              callback(null,{ });
            }else{
              if( doc.face_id == null && doc.face_image_path != null ){
                FaceAPI.GetFaceIdByImage(doc.face_image_path, (err,faceId)=>{
                  Reservation.update({ _id : doc._id }, { face_id : faceId }, (err)=>{
                    callback(null,{ pw1 : doc.password, faceId : faceId });
                  });
                });
              }else{
                callback(null,{ pw1 : doc.password, faceId : doc.face_id });
              }
            }
          });
        }
      }
    });
  },
  'GetDeviceLogs' : (offset,limit,user_id,device_id,callback)=>{
    callback = callback || ()=>{};
    offset = Number(offset) || 0;
    limit = Number(limit) || 30;

    if(!user_id || !device_id){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }
    Room
    .findOne({ user_id : user_id, device_id : device_id})
    .then((doc)=>{
      if( doc == null){
        callback("존재하지 않는 디바이스 정보입니다.",null);
      }else{
        DeviceLog
        .find({ device_id : device_id })
        .sort({ createdAt : -1 })
        .skip(offset)
        .limit(limit)
        .exec(callback);
      }
    });
  },
  'InsertDeviceLog' : (log,callback)=>{
    callback = callback || ()=>{};

    let device_id = log.device_id;
    let pass_status = log.pass_status;
    let user = '';
    let room = '';

    if(!device_id  || !pass_status ){
      callback("Input Data Error",null);
      return;
    }

    Room.findOne({ device_id : device_id })
    .then((doc)=>{
      if( doc == null){
        throw new Error("Device isn't registered");
      }else{
        room = doc;
        log.room_id = doc._id;
        return User.findOne({ _id : doc.user_id });
      }
    })
    .then((doc)=>{
      user = doc;
      return redis.hget('device_pass_status',device_id);
    })
    .then((result)=>{
      let count = Number(result) || 0;
      if(pass_status == '인증 실패'){
        if(count == 2){
          if(PhoneNumberRegex.test(user.phoneNumber)){
            const sms = '['+room.title.substring(0,10)+'] 공간이 3번 이상 인증 실패하였습니다. All-Door';
            sendSMS(user.phoneNumber.replace(/-/gi,''),sms);
          }
          return redis.hset('device_pass_status',device_id,String(0));
        }else{
          return redis.hset('device_pass_status',device_id,String(count+1));
        }
      }else{
        return redis.hset('device_pass_status',device_id,String(0));
      }
    })
    .then((doc)=>{
      return new DeviceLog(log).save();
    })
    .then((doc)=>{
      callback(null,doc);
    })
    .catch((e)=>{
      switch (e.message) {
        case "Device isn't registered":
          callback(e.message,null);
          break;
        default:
          callback(String(e),null);
      }
    });
  },
  'SetOpenStatus' : (device_id,open,callback)=>{
    callback = callback || ()=>{};
    open = Number(open) || 0;

    if( !device_id || !open ){
      callback('입력 데이터를 확인해주세요.',null);
      return;
    }
    Device.findOne({ _id : device_id })
    .then((doc)=>{
      if(doc == null){
        throw new Error('존재하지 않는 디바이스ID입니다.');
      }else{
        return Room.findOne({ _id : device_id });
      }
    })
    .then((doc)=>{
      if(doc == null){
        throw new Error('등록되지 않는 디바이스ID입니다.');
      }else{
        return redis.hget('device_info',device_id);
      }
    })
    .then((doc)=>{
      if( doc == null ){
        throw new Error('디바이스 연결을 확인해주세요.');
      }else{
        doc = JSON.parse(doc);
        redis.hset('device_info',device_id,JSON.stringify({
          updatedAt : doc.updatedAt,
          open : open,
          device_id : doc.device_id,
          battery_status : doc.battery_status
        }));
      }
    })
    .catch((e)=>{
      switch (e.message) {
        case '디바이스 연결을 확인해주세요.':
        case '등록되지 않는 디바이스ID입니다.':
        case '존재하지 않는 디바이스ID입니다.':
          callback(e.message,null);
          break;
        default:
        callback(String(e),null);
      }
    });
  }
}
