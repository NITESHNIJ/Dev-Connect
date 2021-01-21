const express=require('express');
const passport=require('passport');
const { profile, signIn, signUp,createUser,createSession, destroySession, update, reset_pass, render_resetpage, finallyResetPass, getAll, viewUser} = require('../controllers/user_controller');
const router =express.Router();

router.get('/profile',passport.checkAuthentication,profile);
router.get('/sign-in',signIn);
router.get('/sign-up',signUp);

router.get('/all',getAll);

router.get('/viewuser/:id',viewUser);

router.get('/reset_pass/:token',render_resetpage);
router.post('/reset_pass/:token',finallyResetPass);
router.post('/reset_pass',reset_pass)
router.get('/sign-out',destroySession);
router.post('/create',createUser);
router.post('/update/:id',passport.checkAuthentication,update);
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/users/sign-in'}),createSession);

module.exports=router;