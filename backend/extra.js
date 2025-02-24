const express =require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require("./models/user")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.get('/set' , (req, res)=>{
    res.cookie("token", "hello");
    res.json({success: true});
});
app.get('/get' , (req, res)=>{
    console.log('Cookies: ', req.cookies)
    res.json({success: true});
});
app.get('/clear' , (req, res)=>{
    res.cookie("token", "");
    res.json({success: req.cookies});
});


app.listen(3001);