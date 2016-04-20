'user strict'
const express = require('express');
const router = express.Router();
const passport = require('../controller/passport');

router.get('/', (req, res, next)=>{
  res.render('page-login',{});
});

router.post('/',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'}));

module.exports = router;
