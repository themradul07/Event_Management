// const mongoose = require('mongoose');

// mongoose.connect(`mongodb+srv://gandhisir80:KvcMYx9UsfbiqD6B@cluster0.tmfcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

// const eventSchema = mongoose.Schema({
//     img: String,
//     category: String,
//     month : String,
//     date: Date,
//     title: String,
//     description: String,
//     time: String,
//     medium: String,
//     venue: String,
//     participants: [],

// });

// module.exports = mongoose.model("event" , eventSchema);

const mongoose = require('mongoose');

// const uri = "mongodb+srv://gandhisir80:KvcMYx9UsfbiqD6B@cluster0.tmfcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// mongoose.connect(uri, clientOptions);

const eventSchema = new mongoose.Schema({
    img: String,
    category: String,
    month: String,
    date: Date,  // Change to Number if storing only day numbers
    title: String,
    description: String,
    time: String,
    medium: String,
    venue: String,
    participants: [{
        name: String,
        id: mongoose.Schema.Types.ObjectId, // Assuming 'id' is an ObjectId
      },]  // Define type explicitly
});

module.exports = mongoose.model("Event", eventSchema);
