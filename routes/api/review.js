'use strict'
const express = require('express');
const router = express.Router();
const upload = require('../../controller/multer');
const Review = require('../../controller/review');
const User = require('../../controller/user');
/*
* 모든 리뷰 정보 가지고 오기
* GET /api/review
*/
router.get('/',(req,res,next)=>{
  Review.GetReviews(req.query.offset,req.query.limit,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 특정 리뷰 정보 가지고 오기
* GET /api/review/:review_id
*/
router.get('/:review_id',(req,res,next)=>{
  Review.GetReviewByReviewId(req.params.review_id,(err,doc)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,doc);
    }
  });
});

/*
* 특정 방 리뷰 정보 가지고 오기
* GET /api/review/room/:room_id
*/
router.get('/room/:room_id',(req,res,next)=>{
  Review.GetReviewsByRoomId(req.query.offset,req.query.limit,req.params.room_id,(err,docs)=>{
    if(err){
      response.Error(res,err);
    }else{
      response.Data(res,docs);
    }
  });
});

/*
* 특정 방 리뷰 작성하기
* POST /api/review/room/:room_id
*/
router.post('/room/:room_id',upload.array('image',5),(req,res,next)=>{
  let images = [];
  for(let i=0,len = req.files.length;i<len;i++){
    images.push(req.files[i].filename);
  }

  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let review = {
        user_id : user.userid,
        room_id : req.params.room_id,
        reservation_id : req.body.reservation_id,
        title : req.body.title,
        detail : req.body.detail,
        images : images
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

/*
* 특정 방 리뷰 수정하기
* PUT /api/review/room/:room_id
*/
router.put('/:review_id',upload.array('add_image',5),(req,res,next)=>{
  let add_images = [];
  for(let i=0,len= req.files.length;i<len;i++){
    add_images.push(req.files[i].filename);
  }

  User.CheckSession(req,(result,user)=>{
    if(result === true){
      let delete_images;
      try {
        delete_images = JSON.parse(req.body.delete_images);
      } catch (e) {

      }

      let review = {
        user_id : user.userid,
        review_id : req.params.review_id,
        title : req.body.title,
        detail : req.body.detail,
        add_images : add_images,
        delete_images : delete_images
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

/*
* 특정 방 리뷰 삭제하기
* PUT /api/review/room/:room_id
*/
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
