'use strict'
const express = require('express');
const router = express.Router();

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
  res.render('mypage',{});
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

module.exports = router;
