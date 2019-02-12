
const mongoose = require('mongoose');


// DB constants 
const url = "mongodb://localhost:27017/toramadb";
const _collectionname = "subjects";

//Connect to the database using mongoose
mongoose.connect(url);
var Schema = mongoose.Schema;

//Defining a data representation

var SubjectSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now},
    courses: [{
        filename: String,
        url: String,
        duration:Number,
        views:Number,
        thumbnail:String,
        Description: String,}]
    })


// Creating a collection
var subData = mongoose.model(_collectionname,SubjectSchema);

module.exports = subData;

