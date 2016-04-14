var express = require('express');
var router = express.Router();
var passport = require('../controller/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{});
});

router.get('/login', function(req, res, next) {
  res.render('page-login',{});
});

router.post('/login',passport.authenticate('local',{ successRedirect: '/', failureRedirect: '/login' }));

module.exports = router;
