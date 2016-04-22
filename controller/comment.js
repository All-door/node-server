'use strict'
const Room = models.Room;
const Comment = models.Comment;

module.exports = {
  'InsertComment' : (comment, callback)=>{
    callback = callback || ()=>{};

    let room_id = comment.room_id;
    let user_id = comment.user_id;
    let content = comment.content;

    if( !room_id || !user_id || !content){
      callback("입력 데이터를 확인해주세요",null);
      return;
    }

    Room.findOne({ _id : room_id})
        .then((doc)=>{
          if( doc == null){
            callback("공간 정보가 존재하지 않습니다",null);
          }else {
            new Comment({
              room_id : room_id,
              user_id : user_id,
              content : content
            }).save(callback);
          }
        })
  },
  'UpdateComment' : (comment,callback)=>{
    callback = callback || ()=>{};

    let comment_id = comment.comment_id;
    let user_id = comment.user_id;
    let content = comment.content;

    if( !user_id || !content){
      callback("입력 데이터를 확인해주세요",null);
      return;
    }

    Comment.findOne({ _id : comment_id, user_id : user_id })
           .then((doc)=>{
             if(doc == null){
               callback("존재하지 않는 코멘트입니다.",null);
             }else{
               let now = new Date();
               Comment.update({ _id : comment_id }, { content : content, updatedAt : now })
                      .exec(callback);
             }
           });
  },
  'RemoveComment' : (user_id,comment_id,callback)=>{
    callback = callback || ()=>{};

    if( !comment_id ){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }

    Comment.findOne({ _id : comment_id, user_id : user_id })
           .then((doc)=>{
             if( doc == null){
               callback("존재하지 않는 코멘트입니다.",null);
             }else{
               Comment.findOne({ _id : comment_id}).remove().exec(callback);
             }
           });
  },
  'GetCommentsByRoomId' : (offset,limit,room_id,callback)=>{
    callback = callback || ()=>{};
    offset = offset || 0;
    limit = limit || 30;

    if( !room_id ){
      callback("입력 데이터를 확인해주세요.",null);
      return;
    }
    Comment.find({ room_id : room_id })
           .sort({ createdAt : -1 })
           .skip(offset)
           .limit(limit)
           .then((docs)=>{
             callback(null,docs);
           });
  }
};
