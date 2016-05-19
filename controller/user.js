'use strict'
const bcrypt = require('bcrypt-then');
const User = models.User;
const PhoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;

module.exports = {
  'CheckSession' : (req, callback)=>{
    callback = callback || ()=>{};

    if(req.isAuthenticated()){
      callback(true,req.user);
    }else{
      callback(false,null);
    }
  },

  'SignUp' : (name, email, password, phoneNumber, callback)=>{
    callback = callback || ()=>{};

    if( !email || !name || !password || !phoneNumber || !PhoneNumberRegex.test(phoneNumber)){
      callback("입력데이터를 확인해주세요.",null);
      return;
    }

    //이메일 중복 확인
    User.findOne({ email : email }).then((doc)=>{
      if( doc === null){
        // Password Salt
        return bcrypt.hash(password, 10);
      }else{
        throw new Error("중복된 이메일 입니다.");
      }
    }).then((password_token)=>{
      let user = new User({
        name : name,
        email : email,
        phoneNumber : phoneNumber,
        password : password_token
      });
      //유저정보 저장
      return user.save();
    }).then((doc)=>{
      if(doc === null){
        throw new Error("회원가입에 실패했습니다");
      }else{
        // 회원가입 완료
        callback(null,doc);
      }
    }).catch((err)=>{
      if( err.message == '중복된 이메일 입니다.'){
        callback(err.message,null);
      }else if( err.message == '회원가입에 실패했습니다.'){
        callback(err.message,null);
      }else{
        callback(err,null);
      }
    });
  },

  'ChangeLoginAt' : (userid, callback)=>{
    callback = callback || ()=>{};

    let now = new Date();
    User.update({ _id : userid }, { loginAt : now }, callback);
  },

  'ChangeUpdateAt' : (userid, callback)=>{
    callback = callback || ()=>{};

    let now = new Date();
    User.update({ _id : userid }, { updatedAt : now }, callback);
  },

  'LogOut' : (req, callback)=>{
    callback = callback || ()=>{};

    if(req.isAuthenticated()){
      req.logout();
      callback(true);
    }else{
      callback(false);
    }
  },

  'ChangeUserPassword' : (userid, origin_password, change_password, callback)=>{
    callback = callback || ()=>{};

    User.findOne({ _id : userid, disable : false })
        .then((doc)=>{
          return bcrypt.compare(origin_password, doc.password);
        }).then((result)=>{
          if(result === true){
            return bcrypt.hash(change_password, 10)
                         .then((password_token)=>{
                           let now = new Date();
                           User.update({ _id : userid }, { password : password_token, updatedAt : now })
                               .then((doc)=>{
                                callback(null,doc);
                               });
                          });
          }else{
            callback("암호가 일치하지 않습니다.",null);
          }
    })
  },

  'RemoveUser' : (userid, callback)=>{
    callback = callback || ()=>{};
    User.update({ _id : userid }, { disable : true },callback);
  }
};
