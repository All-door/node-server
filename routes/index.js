  'use strict'
const express = require('express');
const router = express.Router();
const User = require('../controller/user');
const Room = require('../controller/room');

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('index',{});
});

router.get('/signup',(req,res,next)=>{
  res.render('signup',{});
});

router.get('/login', (req, res, next)=>{
  res.render('login',{});
});

router.get('/logout',(req,res,next)=>{
  req.logout();
  res.redirect('/');
});

router.get('/about',(req,res,next)=>{
  res.render('about',{});
});

router.get('/list',(req,res,next)=>{
  res.render('list',{});
});

router.get('/search',(req,res,next)=>{
  res.render('serach',{});
});

router.get('/mypage',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage',{});
    }else{
      res.redirect('/login');
    }
  });
});

router.get('/mypage/room',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage-room',{});
    }else{
      res.redirect('/login');
    }
  });
});

router.get('/mypage/room/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage-room-modify',{});
    }else{
      res.redirect('/login');
    }
  });
});

router.get('/device',(req,res,next)=>{
  res.render('device',{});
});

router.get('/reservation',(req,res,next)=>{
  res.render('reservation',{});
});

router.get('/room',(req,res,next)=>{
  res.render('room',{});
});

router.get('/room/:room_id',(req,res,next)=>{
  res.render('room',{});
});

router.get('/register',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('register',{});
    }else{
      res.redirect('/login');
    }
  });
});

router.get('/reservation/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      Room.GetRoomByRoomId(req.params.room_id,(err,doc)=>{
        if(!doc){
          res.redirect('/');
        }
        else if(doc.type === '숙박'){
          res.render('reservation-accommodation',{});
        }else{
          res.render('reservation',{});
        }
      });
    }else{
      res.redirect('/login');
    }
  });
});

module.exports = router;
