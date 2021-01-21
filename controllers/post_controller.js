const Post = require('../models/post');
const Comment = require('../models/comment');
const { response } = require('express');
let Like=require('../models/like');
module.exports.create = async (req, res) => {
    try {
        if(req.xhr)
        {
            console.log('xhr upar');
        }
        Post.uploadedpost_img(req, res, async (err) => {
            try{
            if (err) {
                console.log('error multer post controller');
            }
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id,
            });
            if(req.file)
            {
                console.log(req.file);
                post.post_img=Post.post_imgPath+req.file.filename;
            }
            await post.save();
            await post.populate('user').execPopulate();
            if (req.xhr) {
                console.log('xhr request');
                return res.status(200).json({
                    data: {
                        post
                    },
                    message: 'post created'
                })
            }
            return res.redirect('/');
        }
        catch(err)
        {
            console.log('error',err);
            return res.redirect('/');
        }
        })
    }
    catch (err) {
        console.log('err', err);
        return res.redirect('back');
    }

    // Post.create({
    //     content:req.body.content,
    //     user:req.user._id
    // },async (err,post)=>{
    //     if(err)
    //     {
    //         console.log('err in creating post',err);
    //         return;
    //     }
    //     req.flash('success','Post Created Succesfully');
    //     await post.populate('user');
    //         });
}

module.exports.destroy = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        //post.user is a object id only req.user.id will give string no need to use ._id 
        if (req.user.id == post.user) {
            // console.log('here inside',typeof(req.user.id),'seprator',typeof(post.user.id));
            await post.remove();
            await Like.deleteMany({likeable:req.params.id,onModel:'Post'});
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                console.log('in ajax at backend->post controller ');
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: 'post deleted'
                })
            }

            return res.redirect('/');
        }
        console.log('here outside');
    }
    catch (err) {
        console.log('err', err);
        return;
    }
}
