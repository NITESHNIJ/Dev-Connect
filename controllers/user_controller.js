const User= require('../models/user');
const resetPassToken=require('../models/resetPassToken');
const FriendShip=require('../models/friendship');
const mailer=require('../mailers/reset_pass_mailer');
const fs=require('fs');
const path=require("path"); 

module.exports.profile=async (req,res)=>{
    // let user=await User.findById(req.user._id).populate({
    //     path:'friendships',
    //     populate:{
    //         path:'from_user to_user'
    //     }
    // });
    let following=await FriendShip.find({from_user:req.user._id}).populate('to_user');
    let followers=await FriendShip.find({to_user:req.user._id}).populate('from_user');


    return res.render('profile',{
        title:'User Profile',
        following,
        followers
    });
}
module.exports.signUp=(req,res)=>{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('Signup',{
        title:'SignUp'
    })
}
module.exports.signIn=(req,res)=>{
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('Signin',{
        title:'Signin'
    })
}
//TODO:
module.exports.createUser=(req,res)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(err)
        {
            console.log('error in finding user');
            return;
        }
        if(!user)
        {
            User.create({name:req.body.name,email:req.body.email,password:req.body.password},(err,user)=>{
                if(err)
                {
                    console.log('error',err);
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }
        else{
            return res.redirect('/users/sign-in');            
        }
    })
}
module.exports.update=async (req,res)=>{
    if(req.user.id==req.params.id)
    {
        try{
        let user=await User.findById(req.params.id);
        //for a multipart data form body can't be read without multer 
        //so fdoing alll this in below fn 
        //which is a static fn os userSchema having multer fn
        User.uploadedAvatar(req,res,async (err)=>{
            if(err)
            {
                console.log('multer error-->',err);
            }
            user.name=req.body.name;
            user.email=req.body.email;
            if(req.file)
            {
                if(user.avatar)
                {
                    fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                }
            user.avatar=User.avatarPath+req.file.filename;
            }
            await user.save();
            console.log(req.file);
        })
        return res.redirect('back');
        }
        catch(err)
        {
            console.log('error');
            return;
        }

    }
}
//sign-in and create the session for user
module.exports.createSession=(req,res)=>{
    req.flash('success','Logged in succesfully');
    return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{
    req.flash('success','You have logged out');
    req.logout();
    return res.redirect('/');
}
module.exports.reset_pass=async(req,res)=>{
    try{
    const user=await User.findOne({email:req.body.email});
    console.log(user.name," ",user._id);
    if(!user)
    {
        req.flash('success','Email Id does not exist');
        return res.redirect('back');
    }
    const token=await resetPassToken.create({token:Date.now(),user:user._id});
    await token.populate({path:'user',select:'name email'}).execPopulate();
    mailer.resetPassMail(token);

    req.flash('success','Link Sent,Please check Your Email');
    return res.redirect('back');
    }
    catch(err)
    {
        console.log('err',err);
    }
}
module.exports.render_resetpage=async (req,res)=>{
    let token=await resetPassToken.findOne({token:req.params.token});
    return res.render('forgot_pass',{
        title:'reset-pass',
        resetPassToken:token
    });
}
module.exports.finallyResetPass=async (req,res)=>{
    const token=await resetPassToken.findOne({token:req.params.token});
    const user=await User.findById(token.user);
    user.password=req.body.password;
    await user.save();
    token.isValid=false;
    await token.save();
    req.flash('success','Password Reset Succesfully');
    return res.redirect('/users/sign-in');
}

module.exports.getAll=async (req,res)=>{
    const Users=await User.find({});
    //console.log(Users);
    return res.render('AllUsers',{
        title:'All Users',
        Users
    });
}
module.exports.viewUser=async (req,res)=>{
    let user=await User.findById(req.params.id);
    user.password='';
    let alreadyFriend=false;
    if(req.user){
    let friendship=await FriendShip.findOne({from_user:req.user._id,to_user:req.params.id});
    if(friendship)
    {
        alreadyFriend=true;
    }
    }
    return res.render('ViewUser',{
        title:'User Profile',
        user1:user,
        alreadyFriend
    });
}