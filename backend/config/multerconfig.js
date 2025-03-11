// const multer = require('multer');
// const path = require('path');
// const crypto = require('crypto');
// const fs = require('fs');
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;    
// cloudinary.config({
//     cloud_name: "ddyjj570n",
//     api_key: "955836172498119",
//     api_secret: "8_iA5S598M0Ze3k1qjQB-F2F4Lc",
//   });

// const uploadDir = './public/images/upload';

// // Ensure upload directory exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer to upload to Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "uploads", // Cloudinary folder name
//       format: async (req, file) => "png", // Force PNG format
//       public_id: (req, file) => Date.now(), // Unique filename
//     },
//   });

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         crypto.randomBytes(12, (err, bytes) => {
//             if (err) return cb(err);
//             const fn = bytes.toString("hex") + path.extname(file.originalname);
//             cb(null, fn);
//         });
//     }
// });
// const upload = multer({ storage: storage });
// module.exports = upload;



