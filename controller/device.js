'use strict'

const Reservation = models.Reservation;
const DeviceLog = models.DeviceLog;
const Room = models.Room;
const Redis = require('ioredis');
const redis = new Redis();

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
          oepn : 0
        };
1
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

      Room
      .findOne({ device_id : device_id })
      .then((doc)=>{
        if(doc == null){
          callback("공간 정보가 존재하지 않습니다.",null);
        }else{
          let now = GetTodayTimeString();
          let today = GetTodayDateString();

          if( doc.type === '숙박'){
            Reservation
            .findOne({ room_id : doc._id })
            .where("start_day").gte(today)
            .where("end_day").lte(today)
            .then((doc)=>{
              if(doc == null){
                callback(null,{ open : open });
              }else{
                callback(null,{ pw1 : doc.password, open : open})
              }
            });
          }else{
            Reservation
            .findOne({ room_id : doc._id })
            .where("start_day").gte(today)
            .where("end_day").lte(today)
            .where("start_time").gte(now)
            .where("end_time").lte(now)
            .then((doc)=>{
              if(doc == null){
                callback(null,{ open : open});
              }else{
                callback(null,{ pw1 : doc.password , open : open })
              }
            });
          }
        }
      });

    });
  },
  'GetDeviceLogs' : (offset,limit,user_id,device_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

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
  }
}
