const eventModel = require('../models/eventmodel');
const UserModel = require('../models/User');
const { SendVerificationCode, WelcomeEmail, EventAlert } = require('../middleware/Email');


const Upload = require("../helpers/upload");

const uploadFile = async (req, res) => {

    try {
        const upload = await Upload.uploadFile(req.file.path);
        
            req.body.img = upload.secure_url;
            let evnt = await eventModel.create(req.body);
            let emails = await UserModel.find({}, "email");

            await emails.forEach(async e => {
                await EventAlert(e.email, evnt.title, evnt.date, evnt.venue);
            });
            res.redirect("https://eventmanagementdevloop.netlify.app/events");

            // var store = new Store({
            //     file_url:upload.secure_url
            // });
            // var record = await store.save();
            // res.send({ succes: true, msg: 'File Uploaded Successfully!', data: upload.secure_url });

        } catch (error) {
            res.send({ succes: false, msg: error.message });
        }

    }

module.exports = {
        uploadFile
    }