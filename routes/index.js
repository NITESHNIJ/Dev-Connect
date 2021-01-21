const express=require('express');
const { home } = require('../controllers/home_controller');
const router =express.Router();

router.use('/users',require('./users'))
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.get('/',home);
router.use('/likes',require('./likes'));
router.use('/friends',require('./friends'));


module.exports=router;