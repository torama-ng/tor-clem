const mongoose = require('mongoose');
// DB constants 
const url = "mongodb://localhost:27017/Toramadb";
const _collectionname = "video_viewers";

//Connect to the database using mongoose
mongoose.connect(url);
var Schema = mongoose.Schema;

//Defining a data representation
var ViewerSchema = new Schema({
    vid_id: { type: String, required: true },
    vid_viewer: { type: String, required: true },
    view_date: { type: Date, default: Date.now},
});

// Creating a collection
var viewData = mongoose.model(_collectionname, ViewerSchema);

module.exports = viewData;