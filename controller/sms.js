'use strict';
const https = require('https')
const SENDER = process.env.ALL_DOOR_SMS_SENDER || "SENDER";
const APPID =  process.env.ALL_DOOR_SMS_APP_ID || "APIID";
const APIKEY = process.env.ALL_DOOR_SMS_API_KEY || "APIKEY";
const credential = 'Basic '+new Buffer(APPID+':'+APIKEY).toString('base64');

module.exports = function sendSMS(receiver,content){
  const body = JSON.stringify({
    "sender" : SENDER,
    "receivers" : [receiver],
    "content" : content
  });

  const options = {
    host: 'api.bluehouselab.com',
    port: 443,
    path: '/smscenter/v1.0/sendsms',
    headers: {
      'Authorization': credential,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body)
    },
    method: 'POST'
  };

  return new Promise(function(resolve, reject) {
    const req = https.request(options,(res)=>{
      let body = "";
      res.on('data',(d)=>{
        body += d;
      });
      res.on('end',(d)=>{
        if(res.statusCode == 200){
          resolve(JSON.parse(body));
        }else{
          reject(body);
        }
      });
    });

    req.write(body);
    req.end();
    req.on('error',(e)=>{
      reject(e);
    });
  });
}
