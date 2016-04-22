'use strict'
const express = require('express');
const router = express.Router();
const User = require('../../../controller/user');
const Comment = require('../../../controller/comment');

router.get('/:room_id/comment', (req, res, next)=>{
  Comment.GetCommentsByRoomId(req.query.offset,req.query.limit,req.params.room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

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
