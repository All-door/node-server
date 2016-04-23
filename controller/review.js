'use strict'
const Room = models.Room;
const Review = models.Review;
const Reservation = models.Reservation;

module.exports = {
  'InsertReview' : (review,callback)=>{
    callback = callback || ()=>{};

    let user_id = review.user_id;
    let room_id = review.room_id;
    let reservation_id = review.reservation_id;
    let title = review.title;
    let detail = review.detail;
    let images = review.images || [];

    if( !user_id || !room_id || !reservation_id || !title || !detail){
      callback("데이터 정보를 확인해주세요",null);
      return;
    }

    Reservation
    .findOne({ _id : reservation_id, room_id : room_id })
    .then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 예약 정보입니다.",null);
      }else {
        new Review({
          user_id : user_id,
          room_id : room_id,
          reservation_id : reservation_id,
          title : title,
          detail : detail,
          images : images
         }).save()
          .then((doc)=>{
            callback(null,doc);
          })
      }
    });
  },
  'UpdateReview' : (review,callback)=>{
    callback = callback || ()=>{};

    let review_id = review.review_id;
    let user_id = review.user_id;
    let delete_images = review.delete_images || [];
    let add_images = review.add_images || [];

    if(!review_id || !user_id){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }

    Review
    .findOne({ _id : review_id, user_id : user_id})
    .then((doc)=>{
      if(doc == null){
        callback('존재하지 않는 리뷰 정보입니다.',null);
      }else{
        let title = review.title || doc.title;
        let detail = review.detail || doc.detail;
        let images = doc.images;
        let now = new Date();

        for(let i=0,len = delete_images.length;i<len;i++){
          if( images.indexOf(delete_images[i]) !== -1 ){
            images.splice(delete_images[i],1);
          }
        }

        for(let i=0,len = add_images.length;i<len;i++){
          images.push(add_images[i]);
        }

        Review
        .update({ _id : review_id, user_id : user_id }, { title : title, detail : detail, updatedAt : now, images : images})
        .exec(callback);
      }
    });
  },
  'RemoveReview' : (user_id, review_id,callback)=>{
    callback = callback || ()=>{};

    if(!review_id){
      callback("입력 데이터를 확인햊쉐요",null);
      return;
    }

    Review
    .findOne({ _id : review_id, user_id : user_id })
    .then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 리뷰 정보입니다.",null);
      }else{
        Review
        .findOne({ _id : review_id, user_id : user_id})
        .remove()
        .exec(callback);
      }
    });
  },
  'GetReviews' : (offset,limit,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    Review
    .find({})
    .sort({ createdAt : -1 })
    .skip(offset)
    .limit(limit)
    .exec(callback);
  },
  'GetReviewByReviewId' : (review_id,callback)=>{
    callback = callback || ()=>{};

    if(!review_id){
      callback("입력 데이터를 확인해주세요",null);
      return;
    }
    Review
    .findOneAndUpdate({ _id : review_id },{ $inc : { view_count : 1}})
    .then((doc)=>{
      if( doc == null){
        callback("리뷰 정보가 존재하지 않습니다.",null);
      }else{
        callback(null,doc);
      }
    });
  },
  'GetReviewsByRoomId' : (offset,limit,room_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    if( !room_id ){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }
    Room
    .findOne({ _id : room_id })
    .then((doc)=>{
      if(doc == null){
        callback("존재하지 않는 공간입니다.",null);
      }else{
        Review
        .find({ room_id : room_id })
        .sort({ createdAt : -1 })
        .skip(offset)
        .limit(limit)
        .then((docs)=>{
          callback(null,docs);
        });
      }
    });
  }
};
