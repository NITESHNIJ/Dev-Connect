const express=require('express');
const { addFriend } = require('../controllers/friends_controller');
const router =express.Router();
const passport=require('passport');

router.get('/addfriend/:id',passport.checkAuthentication,addFriend);



module.exports=router;
