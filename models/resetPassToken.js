const mongoose=require("mongoose");

const resetTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isValid:{
        type:Boolean,
        default:true
    }
});

const resetPassToken=mongoose.model('resetPassToken',resetTokenSchema);

module.exports=resetPassToken;