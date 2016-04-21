module.exports = {
  'Error' : (res,err)=>{
    res.json({
      "status" : 400,
      "meessage" : err
    }).status(200);
  },
  'AuthFail' : (res)=>{
    res.json({
      "status" : 401,
      "message" : "인증되지 않은 접근입니다."
    }).status(401);
  },
  'User' : (res,user)=>{
    res.json({
      "status" : 200,
      "user" : user
    }).status(200);
  },
  'Data' : (res,data)=>{
    res.json({
      "status" : 200,
      "data" : data
    }).status(200);
  },
  'Message' : (res,message)=>{
    res.json({
      "status" : 200,
      "message" : message
    }).status(200);
  },
  'Login' : (res,user)=>{
    res.json({
      "status" : 200,
      "message" : "로그인에 성공했습니다",
      "user" : user
    }).status(200);
  }
};
