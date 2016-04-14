var express = require('express');
var router = express.Router();
var passport = require('../controller/passport');

router.get('/', function(req, res, next) {
  res.render('page-login',{});
});

router.post('/',passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login'}));

module.exports = router;
