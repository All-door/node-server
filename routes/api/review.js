'use strict'
const express = require('express');
const router = express.Router();
const Review = require('../../controller/review');
const User = require('../../controller/user');

router.get('/',(req,res,next)=>{
  Review.GetReviews(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

router.get('/:review_id',(req,res,next)=>{
  Review.GetReviewByReviewId(req.params.review_id,(err,doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,doc);
    }
  });
});

router.get('/room/:room_id',(req,res,next)=>{
  Review.GetReviewsByRoomId(req.query.offset,req.query.limit,req.params.room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});
router.post('/room/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let review = {
        user_id : user.userid,
        room_id : req.params.room_id,
        reservation_id : req.body.reservation_id,
        title : req.body.title,
        detail : req.body.detail
      };
      Review.InsertReview(review,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,'리뷰 등록이 완료되었습니다.');
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.put('/:review_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let review = {
        user_id : user.userid,
        review_id : req.params.review_id,
        title : req.body.title,
        detail : req.body.detail
      };
      Review.UpdateReview(review,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,'리뷰 수정이 완료되었습니다.');
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});

router.delete('/:review_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Review.RemoveReview(user.userid,req.params.review_id,(err,doc)=>{
        if(err){
          response.Error(res,err);
        }else{
          response.Message(res,"리뷰 삭제가 완료되었습니다.")
        }
      });
    }else{
      response.AuthFail(res);
    }
  });
});
module.exports = router;
