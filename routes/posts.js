const {create, destroy}=require('../controllers/post_controller');
const express=require('express');
const passport=require('passport');

const Router=express.Router();

Router.post('/create',passport.checkAuthentication,create);
Router.get('/destroy/:id',passport.checkAuthentication,destroy);

module.exports=Router;