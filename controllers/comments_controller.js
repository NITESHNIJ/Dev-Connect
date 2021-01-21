const Comment=require('../models/comment');
const Post=require('../models/post');
let queue=require('../config/Kue');
const commentsmailer=require('../mailers/comment_mailer');
const comment_email_worker=require('../workers/comment_email_worker');
module.exports.create=async (req,res)=>{
   try{
    const post=await Post.findById(req.body.post);
    if(post){
        let comment=await Comment.create({
            content:req.body.content,
            post:req.body.post,
            user:req.user._id
        });
        await comment.populate({path:'user',select:'name email'}).execPopulate();
        await post.comments.push(comment);
        await post.save();
       //commentsmailer.newComment(comment);
        let job = queue.create('emails', comment).save((err) => {
            if (err) {
                console.log('error in creating a queue');
            }
            console.log('Job Enqueued',job.id);
        })
        if(req.xhr)
        {
            return res.json({
                data:{
                    comment,
                },
                message:'comment created'
            })
        }
        return res.redirect('/');
    }

   }
   catch(err){
       console.log('error',err);
       return; 
   }
}

module.exports.destroy=async (req,res)=>{
    try{
    let comment=await Comment.findById(req.params.id);
    let postId=comment.post;
    let post=await Post.findById(postId);
    if(comment.user==req.user.id || post.user==req.user.id)
    {
        
        comment.remove();
      
        console.log(post.comments);
        
        post.comments=[...post.comments.filter((id)=>
        {
            console.log(id,' ',typeof(id));
            console.log(req.params.id,' ',typeof(req.params.id));
            console.log(id==req.params.id);
            return !(id==req.params.id)
        })];
        console.log(post.comments);
        await post.save();
        if(req.xhr)
        {
            console.log('here in ajax at backend');
            return res.json({
                data:{
                    comment_id:req.params.id
                },
                message:'comment deleted'
            });
        }
        return res.redirect('/');
    }
    }
    catch(err)
    {
        console.log('err:',err);
        return;
    }

}