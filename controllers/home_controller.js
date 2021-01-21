const Post=require('../models/post');
module.exports.home=async (req,res)=>
{
//return res.end('<h1>Express is up</h1>');
let posts=await Post.find({})
.populate('user')
.populate({
    path:'comments',
    populate:{
        path:'user',
        
    }
})
.sort('-createdAt');
return res.render('Home',{
    title:'Dev-Connect',
    posts
})
}