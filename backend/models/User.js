const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Events');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    participated: [],
    isAdmin : Boolean ,
    isVerified:{
        type: Boolean,
        default:false
    },
    verificationCode:{
        type:String
    },
},{timestamps:true});

module.exports = mongoose.model("user", userSchema);