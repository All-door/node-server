var bcrypt = require('bcrypt-then');
var User = models.User;

module.exports = {
  'CheckSession' : function(req, callback){
    callback = callback || function(){};

    if(req.isAuthenticated()){
      callback(true,req.user);
    }else{
      callback(false,null);
    }
  },

  'SignUp' : function(name, email, password, callback){
    callback = callback || function(){};

    //이메일 중복 확인
    User.findOne({ email : email }).then(function(doc){
      if( doc === null){
        // Password Salt
        return bcrypt.hash(password, 10);
      }else{
        throw new Error("중복된 이메일 입니다.");
      }
    }).then(function(password_token){
      var user = new User({
        name : name,
        email : email,
        password : password_token
      });
      //유저정보 저장
      return user.save();
    }).then(function(doc){
      if(doc === null){
        throw new Error("회원가입에 실패했습니다");
      }else{
        // 회원가입 완료
        callback(null,doc);
      }
    }).catch(function(err){
      // 에러처리
      callback(err.message,null);
    });
  },

  'ChangeLoginAt' : function(userid, callback){
    callback = callback || function(){};

    var now = new Date();
    User.update({ _id : userid }, { loginAt : now }, callback);
  },

  'ChangeUpdateAt' : function(userid, callback){
    callback = callback || function(){};

    var now = new Date();
    User.update({ _id : userid }, { updatedAt : now }, callback);
  },

  'LogOut' : function(req, callback){
    callback = callback || function(){};

    if(req.isAuthenticated()){
      req.logout();
      callback(true);
    }else{
      callback(false);
    }
  },

  'ChangeUserPassword' : function(userid, origin_password, change_password, callback){
    callback = callback || function(){};

    this.ChangeUpdateAt(userid);
    User.findOne({ _id : userid, disable : false }).then(function(doc){
      return bcrypt.compare(origin_password, doc.password);
    }).then(function(result){
      if(result === true){
        return bcrypt.hash(change_password, 10);
      }else{
        throw new Error("잘못된 암호입니다.");
      }
    }).then(function(password_token){
      return User.update({ _id : userid }, { password : password_token });
    }).then(function(doc){
      callback(null, doc);
    }).catch(function(err) {
      callback(err.message, false);
    });
  },

  'RemoveUser' : function(userid, callback){
    callback = callback || function(){};
    User.update({ _id : userid }, { disable : true },callback);
  }
};
