const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Register",
        required:true
    },
    from:{
        type:Date,
        required:true
    },
    to:{
        type:Date,
        required:true
    },
    currentUser:{
        type:Boolean,
        required:true
    },
    expireAt: { 
        type: Date, 
        index: { expires: '0s' }
    }
});

module.exports=mongoose.model("Users",userSchema,"users");