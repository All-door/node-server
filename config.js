'use strict'
const config = {
  Name : process.env.ALL_DOOR_NAME ? process.env.ALL_DOOR_NAME : 'alldoor',
  MongoDB : process.env.ALL_DOOR_MONGODB ? process.env.ALL_DOOR_MONGODB : 'mongodb://localhost/alldoor',
  ImagePath : process.env.ALL_DOOR_IMAGE_PATH ? process.env.ALL_DOOR_IMAGE_PATH : '/root/images',
  Port : process.env.ALL_DOOR_PORT ? process.env.ALL_DOOR_PORT : '3000',
  RedisOption : {

  }
};

module.exports = config;
