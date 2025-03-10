const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://gandhisir80:KvcMYx9UsfbiqD6B@cluster0.tmfcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
// require('dotenv').config();
// const uri = process.env.MONGO_URI;
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// mongoose.connect(uri, clientOptions);

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