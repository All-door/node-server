'use strict'
let express = require('express');
let router = express.Router();
let Device = require('../../controller/device');
let User = require('../../controller/user');

/*
* 도어락 디바이스의 상태 확인
* GET /api/device/:device_id/status
*/
router.get('/:device_id/status',(req,res,next)=>{
  Device.GetDeviceStatus("user",req.params.device_id,(err,doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,doc);
    }
  });
});

/*
* 도어락 디바이스의 임시 비밀번호 발급 / 상태 정보 저장 / 디바이스 전용 API
* POST /api/device/:device_id
*/
router.post('/:device_id',(req,res,next)=>{
  Device.DeviceRoutine(req.params.device_id,req.body.battery_status,(err,device_setting)=>{
    if(err){
      response.Error(res,err);
    }else{
      res.json({
        "status" : 200,
        "pw1" : device_setting.pw1 || "None",
        "pw2" : device_setting.pw2 || "None",
        "ArtikDeviceID" : device_setting.artik_cloud_id || "None",
        "ArtikDeviceAccessToken" : device_setting.artik_cloud_access_token || "None",
        "FaceId" : device_setting.faceId || "None"
      }).status(200);
    }
  });
});

/*
* 도어락 디바이스의 출입 기록
* GET /api/device/:device_id/log
*/
router.get('/:device_id/log',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Device.GetDeviceLogs(req.query.offset,req.query.limit,user.userid,req.params.device_id,(err,docs)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Data(res,docs);
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 도어락 디바이스의 출입 기록 저장 / 디바이스 전용 API
* GET /api/device/:device_id/log
*/
router.post('/:device_id/log',(req,res,next)=>{
  const status = ['인증 실패', '마스터키 접근','임시키 접근'];
  Device.InsertDeviceLog({
    device_id : req.params.device_id,
    pass_status : status[req.body.pass_status] // 0-인증실패 1-마스터키 접근 2-임시키 접근
  },(err,doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Message(res,"Logging Success");
    }
  });
});

module.exports = router;
