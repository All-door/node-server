var express = require('express');
var router = express.Router();

/*
* /api/user/favorites
*/
router.get('/',function(req, res, next) {
  res.send("favorites");
});

router.post('/',function(req, res, next) {

});

router.delete('/',function(req, res, next) {

});

module.exports = router;
