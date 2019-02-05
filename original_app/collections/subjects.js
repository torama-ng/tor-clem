<<<<<<< HEAD
const mongoose = require('mongoose');
=======

const mongoose = require('mongoose');

>>>>>>> 6d3c240465bee4508bccaa88982db5a68501137e
// DB constants 
const url = "mongodb://localhost:27017/toramadb";
const _collectionname = "subjects";

//Connect to the database using mongoose
mongoose.connect(url);
var Schema = mongoose.Schema;

//Defining a data representation
<<<<<<< HEAD
var SubjectSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now},
    courses: [{
        filename: String,
        url: String,
        duration:Number,
        views:Number,
        thumbnail:String,
        Description: String,
=======
var subjectDataSchema = new Schema({
    name: { type: String, required: true },
    time: { type: Date, default: Date.now },
    courses: [{
        filename: {type: String, required: true},
        author: String,
        duration: Number,
        description: String

>>>>>>> 6d3c240465bee4508bccaa88982db5a68501137e
    }]
});

// Creating a collection
<<<<<<< HEAD
var subData = mongoose.model(_collectionname, SubjectSchema);

module.exports = subData;
=======
var subjectData = mongoose.model(_collectionname, subjectDataSchema);
//console.log(userData);
module.exports = subjectData;
>>>>>>> 6d3c240465bee4508bccaa88982db5a68501137e
