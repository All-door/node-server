const request = require('request');
const fs = require('fs');

module.exports = {
  'GetFaceIdByImage' : (imagepath, callback)=>{
    const options = {
      method: 'POST',
      url: 'https://api.projectoxford.ai/face/v1.0/detect',
      headers: {
        'cache-control': 'no-cache',
        'content-type': 'application/octet-stream',
        'ocp-apim-subscription-key': process.env.ALL_DOOR_FACE_API_KEY
      },
      body: fs.readFileSync(imagepath)
     };

    request(options, (err, response, body)=>{
      if (err) callback(err,null);
      else {
        const json_data = JSON.parse(body);
        if( json_data.length != 0 && json_data[0].hasOwnProperty('faceId')){
          callback(null, json_data[0].faceId);
        }else{
          callback(null, "None");
        }
      }
    });
  }
};
