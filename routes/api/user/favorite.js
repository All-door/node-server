'use strict'
const express = require('express');
const router = express.Router();
const Favorite = require('../../../controller/favorite');
const User = require('../../../controller/user');

/*
* 유저의 관심방 가지고 오기
* GET /api/user/favorite
*/
router.get('/',(req, res, next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Favorite.GetFavorites(req.params.offset,req.params.limit,user.userid,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Data(res,doc);
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 유저의 관심방 추가하기
* POST /api/user/favorite
*/
router.post('/',(req, res, next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      let room_id = req.body.room_id;
      Favorite.AddFavorites(user.userid,room_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"관심 공간이 등록되었습니다");
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 유저의 관심방 추가하기
* POST /api/user/favorite
*/
router.delete('/',(req, res, next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      let room_id = req.body.room_id || req.query.room_id || req.params.room_id;
      Favorite.RemoveFavorite(user.userid,room_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"관심 공간이 삭제되었습니다.");
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

module.exports = router;
