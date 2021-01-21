const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const POST_PATH=path.join('/uploads/users/posts/');

const postSchema=new mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    post_img:{
        type:String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},{
    timestamps:true
})
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',POST_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
//defining static fn uploadedAvatar for userSchema
//single for field from which files come in that form
postSchema.statics.uploadedpost_img=multer({storage:storage}).single('post_img');
postSchema.statics.post_imgPath=POST_PATH;



const Post=mongoose.model('Post',postSchema);

module.exports=Post;