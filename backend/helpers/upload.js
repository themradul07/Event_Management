const cloudinary = require("../config/cloudinary");
const logger = require("../utils/logger");

const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        logger.info(`Cloudinary Upload Successful: ${result.secure_url}`);
        return result;
    } catch (error) {
        logger.error(`Cloudinary upload failed: ${error.message}`);
        throw error;
    }
};

module.exports = {
    uploadFile
};