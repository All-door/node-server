'use strict'
const express = require('express');
const router = express.Router();
const passport = require('../controller/passport');
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
  res.render('search',{});
});

router.get('/mypage',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage',{});
    }else{
      res.redirect('/login?redirect=mypage');
    }
  });
});

router.get('/mypage/room',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage-room',{});
    }else{
      res.redirect('/login?redirect=mypage/room');
    }
  });
});

router.get('/mypage/room/:room_id',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if(result === true){
      res.render('mypage-room-modify',{});
    }else{
      res.redirect('/login?redirect=mypage/room/'+req.params.room_id);
    }
  });
});

router.get('/mypage/reservation',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      res.render('mypage-reservation',{});
    }else{
      res.redirect('/login?redirect=mypage/reservation');
    }
  });
});

router.get('/mypage/reservation/old',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      res.render('mypage-reservation-old',{});
    }else{
      res.redirect('/login?redirect=mypage/reservation/old');
    }
  });
});

router.get('/mypage/change',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      res.render('mypage-change',{});
    }else{
      res.redirect('/login?redirect=mypage/change');
    }
  });
});

router.get('/mypage/favorite',(req,res,next)=>{
  User.CheckSession(req,(result,user)=>{
    if( result === true){
      res.render('mypage-favorite',{});
    }else{
      res.redirect('/login?redirect=mypage/favorite');
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
      res.redirect('/login?redirect=register');
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
      res.redirect('/login?redirect=reservation/'+req.params.room_id);
    }
  });
});

router.get('/login/facebook',passport.authenticate('facebook'));
router.get('/login/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/login/facebook/success',
  failureRedirect: '/login/facebook/fail'
}));

router.get('/login/facebook/success',(req,res,next)=>{
  res.redirect('/');
});

router.get('/login/facebook/fail',(req,res,next)=>{
  res.redirect('/login');
});

module.exports = router;
