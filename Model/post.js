const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const postSchema=new Schema({
    photo:{
    type:[],
    },
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("posts",postSchema);