'use strict'
const express = require('express');
const router = express.Router();
const User = require('../../../controller/user');
const Comment = require('../../../controller/comment');

/*
* 특정 공간(방)의 코멘트 가지고 오기
* GET /api/room/:room_id/comment
*/
router.get('/:room_id/comment', (req, res, next)=>{
  Comment.GetCommentsByRoomId(req.query.offset,req.query.limit,req.params.room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 특정 공간(방)의 코멘트 작성하기
* POST /api/room/:room_id/comment
*/
router.post('/:room_id/comment', (req, res, next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let comment = {
        user_id : user.userid,
        room_id : req.params.room_id,
        content : req.body.content
      };
      Comment.InsertComment(comment,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"코멘트 입력이 완료되었습니다.");
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 특정 공간(방)의 코멘트 수정하기
* PUT /api/room/:room_id/comment
*/
router.put('/:room_id/comment/:comment_id', (req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let comment = {
        user_id : user.userid,
        comment_id : req.params.comment_id,
        content : req.body.content
      };
      Comment.UpdateComment(comment,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"코멘트 수정이 완료되었습니다.");
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

/*
* 특정 공간(방)의 코멘트 삭제하기
* DELETE /api/room/:room_id/comment
*/
router.delete('/:room_id/comment/:comment_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result == true){
      Comment.RemoveComment(user.userid,req.params.comment_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"코멘트 삭제가 완료되었습니다.");
        }
      })
    }else {
      response.AuthFail(res);
    }
  });
});

module.exports = router;
