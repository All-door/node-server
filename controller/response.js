module.exports = {
  'Error' : (res,err)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(400).json({
      "status" : 400,
      "meessage" : err
    });
  },
  'AuthFail' : (res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({
      "status" : 401,
      "message" : "인증되지 않은 접근입니다."
    });
  },
  'User' : (res,user)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      "status" : 200,
      "user" : user
    });
  },
  'Data' : (res,data)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      "status" : 200,
      "data" : data
    });
  },
  'Message' : (res,message)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      "status" : 200,
      "message" : message
    });
  },
  'Login' : (res,user)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      "status" : 200,
      "message" : "로그인에 성공했습니다",
      "user" : user
    });
  }
};
