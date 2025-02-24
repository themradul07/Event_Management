const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/Events`);

const eventSchema = mongoose.Schema({
    img: String,
    category: String,
    month : String,
    date: String,
    title: String,
    description: String,
    time: String,
    medium: String,
    venue: String,
    participants: [],

});

module.exports = mongoose.model("event" , eventSchema);