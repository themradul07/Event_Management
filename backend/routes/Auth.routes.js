const express = require('express')

const { register, verifyemail } = require('../controllers/Auth.js');
const AuthRoutes = express.Router();


AuthRoutes.post('/register' , register);
AuthRoutes.post('/verifyemail' , verifyemail);


export default AuthRoutes;