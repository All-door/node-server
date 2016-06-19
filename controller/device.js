'use strict'

const Reservation = models.Reservation;
const Device = models.Device;
const DeviceLog = models.DeviceLog;
const Room = models.Room;
const Redis = require('ioredis');
const redis = new Redis();
const sha1 = require('sha1');

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

    redis
    .hget('device_info',device_id)
    .then((data)=>{
      let now = new Date();
      let status = {};
      let open = 0;

      if(data == null){
        status = {
          updatedAt : now,
          device_id : device_id,
          battery_status : battery_status,
          open : 0
        };

        redis
        .hset('device_info',device_id,JSON.stringify(status))
        .then(()=>{});
      }else{
        let result = JSON.parse(data);
        open = result.open;
        status = {
          updatedAt : now,
          device_id : device_id,
          battery_status : battery_status,
          open : open
        };

        redis
        .hset('device_info',device_id,JSON.stringify(status))
        .then(()=>{});
      }
      Device.findOne({ _id : device_id })
      .then((doc)=>{
        if( doc != null){
          const privateKey = doc.privateKey;
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
                    callback(null,{ open : open });
                  }else{
                    callback(null,{ pw1 : sha1(privateKey+doc.password), open : open });
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
                    callback(null,{ open : open});
                  }else{
                    callback(null,{ pw1 : sha1(privateKey+doc.password), open : open });
                  }
                });
              }
            }
          });
        }else{
          callback("Device ID isn't vaild",null);
        }
      });
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

    if(!device_id  || !pass_status ){
      callback("Input Data Error",null);
      return;
    }

    Room
    .findOne({ device_id : device_id })
    .then((doc)=>{
      if(doc == null){
        callback("Device isn't registered",null);
      }else{
        log.room_id = doc._id;
        new DeviceLog(log)
        .save()
        .then((doc)=>{
          callback(null,doc);
        });
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
