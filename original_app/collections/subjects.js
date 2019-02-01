
const mongoose = require('mongoose');

// DB constants 
const url = "mongodb://localhost:27017/toramadb";
const _collectionname = "subjects";

//Connect to the database using mongoose
mongoose.connect(url);
var Schema = mongoose.Schema;

//Defining a data representation
var subjectDataSchema = new Schema({
    name: { type: String, required: true },
    time: { type: Date, default: Date.now },
    courses: [{
        filename: {type: String, required: true},
        author: String,
        duration: Number,
        description: String

    }]
});

// Creating a collection
var subjectData = mongoose.model(_collectionname, subjectDataSchema);
//console.log(userData);
module.exports = subjectData;