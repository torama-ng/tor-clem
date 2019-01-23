const mongoose = require('mongoose');
// DB constants 
const url = "mongodb://localhost:27017/Toramadb";
const _collectionname = "torama_videos";

//Connect to the database using mongoose
mongoose.connect(url);
var Schema = mongoose.Schema;

//Defining a data representation
var VideoSchema = new Schema({
    vid_url: { type: String, required: true },
    vid_name: { type: String, required: true },
    vid_views: { type: Number, required: false },
    vid_uploader: { type: String, required: false },
    vid_category: { type: String, required: false },
    vid_thumbnail: { type: String, required: false },
    upload_date: { type: Date, default: Date.now},
    vid_comments: {
        user_name: String,
        comment: String,
        date: String
    }
});

// Creating a collection
var videoData = mongoose.model(_collectionname, VideoSchema);

module.exports = videoData;