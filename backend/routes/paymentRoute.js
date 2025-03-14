const express = require('express');
const payment_route = express();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:true }));

const path = require('path');

// payment_route.set('view engine','ejs');
// payment_route.set('views',path.join(__dirname, '../views'));

const paymentController = require('../controllers/paymentController');

// payment_route.get('/', paymentController.renderProductPage);
payment_route.post('/pay', paymentController.createOrder);
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
module.exports = payment_route;