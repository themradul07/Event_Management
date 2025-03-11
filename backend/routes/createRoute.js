const express = require("express");
const user = express();

const path = require('path');
const bodyParser = require('body-parser');

user.use(bodyParser.urlencoded({ extended:true }));
user.use(express.static(path.resolve(__dirname,'public')));

const multer = require('multer');

var uploader = multer({
    storage: multer.diskStorage({}),
    
});

const CreateEvent = require('../controllers/CreateEvent');

user.post('/event', uploader.single("img"), CreateEvent.uploadFile);



module.exports = user;