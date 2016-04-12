var express = require('express');
var router = express.Router();

/*
* /api/user/room
*/

router.get('/',function(req, res, next) {
  res.send("room");
});

router.post('/',function(req, res, next) {

});

router.put('/',function(req, res, next) {

});

router.get('/:id',function(req, res, next){

});

module.exports = router;
