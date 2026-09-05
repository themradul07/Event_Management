const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "ddyjj570n",
    api_key: "955836172498119",
    api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = cloudinary;
