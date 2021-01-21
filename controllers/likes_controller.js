const Like=require('../models/like');
const Post=require('../models/post');
const Comment=require('../models/comment');

exports.toggleLike=async (req,res)=>{
    try{
        //route-->/likes/toggle/?id=abcd&type=post or likes/toggle/?id=abcd&type=comment
        let likeable;
        let deleted=false;

        if(req.query.type == 'Post')
        {
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }
        console.log(likeable._id);
        let existingLike= await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });
        if(existingLike)
        {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            await existingLike.remove();
            deleted=true;
        }
        else{
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike);
            likeable.save();
        }

        return res.json(200,{
            message:"Likes Created or deleted Succesfully",
            data:{
                deleted,
                length:likeable.likes.length
            }
        })

    }
    catch(err)
    {
        console.log('err');
        return res.json(500,{
            message:"Internal Server Error",
            
        });
    }

}