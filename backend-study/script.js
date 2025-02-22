const express = require('express');
const eventModel = require('./eventmodel');
const UserModel = require('./models/EventUser');
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true                  // Allow sending cookies
}));


// Getting Events
app.get('/',  async (req, res) => {
    try{
    let allevnt = await eventModel.find({});
    res.json(allevnt);
    }
    catch{
        res.redirect("http://localhost:5173/");
    }
});

// Posting Events
app.post('/', async (req, res) => {
    let evnt = await eventModel.create(req.body);
    res.redirect("http://localhost:5173/events");
});

// Getting particular event details
app.get('/event/:title', async (req, res) => {
    let Event = await eventModel.find({ title: req.params.title });
    res.json(Event);
})

// creating an account
// app.post('/create', async (req, res) => {
//     let { name, email, password } = req.body;
//      bcrypt.genSalt(saltRounds, async function (err, salt) {
//         bcrypt.hash(password, salt, async (err, hash) => {
//             let createdUser = await UserModel.create({
//                 name,
//                 email,
//                 password: hash,
//             });
//             res.send("done");

//         });
//     });
//     res.send("error ho rha hai")
//     // console.log(req.body);
// });
app.post('/create', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        let createdUser = await UserModel.create({ name, email, password: hash });
        res.json({ ok: true, message: "User created successfully!" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ ok: false, message: "Error creating user" });
    }
});

// logging an account
app.post('/login', async (req, res) => {
    try {
        let dataUser = await UserModel.findOne({ email: req.body.email });
        if (!dataUser) return res.status(401).json({ ok: false, message: "Invalid email or password" });

        bcrypt.compare(req.body.password, dataUser.password, function (err, result) {
            if (err) return res.status(500).json({ ok: false, message: "Error logging user" });

            if (result) {
                let token = jwt.sign({name: dataUser.name , id : dataUser._id}, 'shhhhh');
                console.log(token);

                // Set cookie with options
                res.cookie("token", token, {
                    httpOnly: true,   // Prevents JavaScript access (more secure)
                    secure: false,    // Set to true in production (requires HTTPS)
                    sameSite: "Lax",  // Allows cookies in cross-origin requests with navigation
                });


                return res.status(200).json({ ok: true, message: "Login Successful" });
            } else {
                return res.status(401).json({ ok: false, message: "Invalid email or password" });
            }
        });

    } catch (error) {
        console.error("Error Logging in:", error);
        return res.status(500).json({ ok: false, message: "Error logging user" });
    }
});

// logout an account
app.get('/logout', (req, res) => {
    res.cookie("token", "", { 
        expires: new Date(0),  // Expire immediately
        httpOnly: true, 
        secure: true,  // Use secure cookies in production (HTTPS)
        sameSite: "Strict" 
    });
    res.json({ message: "Logged out successfully" });
});


// get navbar
app.get('/getNavbar', (req, res) => {
    let token = req.cookies.token;  // Extract the token from the cookies

    if (!token) {
        return res.status(401).json({ value: "Unauthorized: No token provided" ,value: false });
    }

    try {
        var decoded = jwt.verify(token, 'shhhhh');  // Verify the token
        console.log(decoded.foo);
        res.json({ message: "Token verified", data: decoded , value :true });
    } catch (err) {
        res.status(403).json({ error: "Forbidden: Invalid token", value: false });
    }
});

function isLoggedIn(req , res, next){
    if(!req.cookies.token) res.redirect("http://localhost:5173/login")
    else{
        jwt.verify(req.cookies.token,'shhhhh' );
        
    }
    next();
}

app.listen(3000, (e) => {
    console.log("listening the app");

});

