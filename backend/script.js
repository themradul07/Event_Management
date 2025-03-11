const express = require('express');
const mongoose = require('mongoose');
const eventModel = require('./models/eventmodel');
const UserModel = require('./models/User');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const upload = require('./config/multerconfig');
const { title } = require('process');
const { SendVerificationCode, WelcomeEmail, EventAlert } = require('./middleware/Email');

require('dotenv').config();

const uri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri, clientOptions);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(
    cors({
        origin: [
            "https://eventmanagementdevloop.netlify.app",
            "http://localhost:5173",
            "https://event-management-dusky-zeta.vercel.app"
        ],
        credentials: true
    })
);



app.use(express.static(path.join(__dirname, "public")));

app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name, isAdmin } = req.body;

        // // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists. Please login." });
        }

        // Hash the password before saving
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        // console.log(req.body)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();


        // Create new user
        const user = new UserModel({
            email,
            password: hashedPassword,  // Store the hashed 
            name,
            verificationCode,
            isAdmin,
        });
        console.log("User:", user)

        await user.save();
        SendVerificationCode(email, verificationCode, name);

        return res.status(201).json({ ok: true, message: "User registered successfully!" });

    } catch (error) {
        return res.status(500).json({ ok: false, message: "Server bhai Error", error: error.message });
    }
});

app.post('/auth/verifyemail', async (req, res) => {
    try {

        const { code } = req.body
        const user = await UserModel.findOne({
            verificationCode: code
        })
        if (!user) {
            return res.status(400).json({ ok: false, message: "Invalid or Expired Code" })
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        await WelcomeEmail(user.email, user.name)

        return res.status(200).json({ ok: true, message: "Code Verified Successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" })

    }
});

app.post('/create', async (req, res) => {
    try {
        let { name, email, password, isAdmin } = req.body;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        let createdUser = await UserModel.create({ name, email, isAdmin, password: hash });
        res.json({ ok: true, message: "User created successfully!" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ ok: false, message: "Error creating user" });
    }
});

// Getting Events
app.get('/', async (req, res) => {
    try {
        let allevnt = await eventModel.find({});
        res.json(allevnt);
    }
    catch {
        res.redirect("https://eventmanagementdevloop.netlify.app/");
    }
});

var createRoute = require('./routes/createRoute')
app.use('/create', createRoute);

// Checking Registered or not
app.get('/register/part/:event', isLoggedIn, async (req, res) => {
    let user = await UserModel.findOne({ _id: req.user.id });
    let eventTitle = req.params.event;


    // Correct way: find the index of the event object
    let value = user.participated.findIndex(e => e.title === eventTitle);


    res.json({ participated: value !== -1 });

});

// Getting particular event details
app.get('/event/:title', isLoggedIn, async (req, res) => {
    let Event = await eventModel.find({ title: req.params.title });
    res.json(Event);
})

// Register for event
app.post('/register/:title', isLoggedIn, async (req, res) => {
    console.log(req.params.title);
    let user = await UserModel.findOne({ _id: req.user.id });
    let event = await eventModel.findOne({ title: req.params.title })
    console.log(user);
    console.log(event);
    user.participated.push({ title: event.title })
    user.save();
    event.participants.push({ name: user.name, id: user.id })
    event.save();

    res.status(200).json({ task: true })

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


// logging an account
app.post('/login', async (req, res) => {
    try {
        let dataUser = await UserModel.findOne({ email: req.body.email });
        if (!dataUser) return res.status(401).json({ ok: false, message: "Invalid email or password" });

        bcrypt.compare(req.body.password, dataUser.password, function (err, result) {
            if (err) return res.status(500).json({ ok: false, message: "Error logging user" });

            if (result) {
                let token = jwt.sign({ name: dataUser.name, id: dataUser._id }, 'shhhhh');
                console.log(token);

                // Set cookie with options
                // res.cookie("token", token, {
                //     httpOnly: true,   // Prevents JavaScript access (more secure)
                //     secure: false,    // Set to true in production (requires HTTPS)
                //     sameSite: "Lax",  // Allows cookies in cross-origin requests with navigation
                // });
                res.cookie("token", token, {
                    httpOnly: true,   // Prevents JavaScript access (more secure)
                    secure: true,     // Ensures cookie is only sent over HTTPS
                    sameSite: "None", // Allows cross-site cookies (required for third-party cookies)
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
        httpOnly: true,   // Prevents JavaScript access (more secure)
        secure: true,     // Ensures cookie is only sent over HTTPS
        sameSite: "None", // Allows cross-site cookies (required for third-party cookies)
    });
    res.json({ message: "Logged out successfully" });
});


// get navbar
app.get('/getNavbar', async (req, res) => {
    let token = req.cookies.token;  // Extract the token from the cookies

    if (!token) {
        return res.status(401).json({ value: "Unauthorized: No token provided", value: false });
    }

    try {
        var decoded = jwt.verify(token, 'shhhhh');  // Verify the token
        console.log(decoded);
        let user = await UserModel.findOne({ _id: decoded.id });
        console.log(user);
        res.json({ data: decoded, value: true, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(403).json({ error: "Forbidden: Invalid token", value: false });
    }
});

// get profile
app.get('/profile', isLoggedIn, async (req, res) => {

    try {
        let user = await UserModel.findOne({ _id: req.user.id });
        console.log(user);
        res.json(user);
    } catch (err) {
        res.status(403).json({ error: "Forbidden: Invalid token", value: false });
    }
});

function isLoggedIn(req, res, next) {
    if (!req.cookies?.token) {
        // console.log(req)
        return res.json({ value: true }); // Return to stop execution
    }

    try {
        req.user = jwt.verify(req.cookies.token, "shhhhh");
        console.log(req.user);
        next(); // Call next() only if verification succeeds
    } catch (err) {
        return res.redirect("https://eventmanagementdevloop.netlify.app/login"); // Redirect if token is invalid
    }
}

app.listen(3000, (e) => {
    console.log("listening the app");

});