'use strict'
const config = {
  Name : 'alldoor',
  MongoDB : 'mongodb://localhost/alldoor',
  ImagePath : process.env.ALL_DOOR_IMAGE_PATH ? process.env.ALL_DOOR_IMAGE_PATH : '/root/images',
  Port : '3000',
  RedisOption : {

  }
};

module.exports = config;
