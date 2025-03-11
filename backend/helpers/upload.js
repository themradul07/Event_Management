const cloudinary = require("cloudinary").v2;
const dotenv =require('dotenv');
dotenv.config();
          
cloudinary.config({ 
    cloud_name:"ddyjj570n",
    api_key: "955836172498119",
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFile = async(filePath) => {

    try {
        
        const result = await cloudinary.uploader.upload(filePath);
        console.log(result)
        return result;
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    uploadFile
}