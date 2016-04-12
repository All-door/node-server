var express = require('express');
var router = express.Router();
var Room = require('../../controller/room');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
