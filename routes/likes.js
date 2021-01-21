const express=require('express');
const { toggleLike } = require('../controllers/likes_controller');
const router =express.Router();
const passport=require('passport');

router.get('/toggle',passport.checkAuthentication,toggleLike);



module.exports=router;
