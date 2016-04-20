'use strict'
const express = require('express');
const router = express.Router();

/*
* /api/user/favorites
*/
router.get('/',(req, res, next)=>{
  res.send("favorites");
});

router.post('/',(req, res, next)=>{

});

router.delete('/',(req, res, next)=>{

});

module.exports = router;
