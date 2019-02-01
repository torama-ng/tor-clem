var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require("path");
const fs = require("fs");

router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));


const videosPath = path.join(__dirname, '../videos');

// Function to list folders in videos dir
var folders = fs.readdirSync(videosPath);


// Each folder is a video category.
// for each category, get all the mp4 files
catObj = [];  //store all folders and their mp4files
let mtime = 0;

folders.forEach(function (folder, index) {
  fpath = path.join(__dirname, '../videos', folder);

  mp4files = fs.readdirSync(fpath);
  let stats = fs.statSync(fpath);
  mtime = new Date(stats.mtime);
  let seconds = (new Date().getTime() - stats.mtime) / 1000;
  let gid = stats.dev + stats.ino;
  let days = (seconds / (60 * 60 * 24)).toFixed(0);
  console.log(`modification time ${days} days`);
  catObj.push({ category: folder, files: mp4files, mtime: days, gid: gid })
  
});




// Load and call the user collections from the collections folder
const videoData = require('../collections/videos');


// Load and call the subjects collections from the collections folder
const subjectsData = require('../collections/subjects');

const allVideos = require('../randomfilepicker');
var videosSync = [];

videosSync = allVideos.findVideos('videos');

console.log(__dirname);
/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.session.user) {

    videosSync.forEach(path => {

      //var splitPath = path.url.split('/');
      var name = getName(path.url);
      var category = getCategory(path.url);

      // Changing all mp4 formats to jpg
      var splitName = name.split(".");
      var snapshot = splitName[0];
      var thumbs = snapshot + ".jpg";

      console.log("Snap ------ "+snapshot);

      videoData.findOne({ vid_name: name }, (err, doc) => {
        if (err) throw err;
        if (doc) {
          console.log('Video in database');
        } else {

          // Video Thumbnail
          //convertToThumbnail(category, name);
          // var id = new Date().toLocaleTimeString() + "_"+new Date().getSeconds() + "Torama"+ new Date().getHours();
          var vid_items = {
            vid_url: path.url,
            vid_name: name,
            vid_views: 1,
            vid_uploader: req.session.user.email,
            vid_category: category,
            vid_thumbnail:thumbs
          }

          var data = new videoData(vid_items);
          data.save();

        }

      })

    });

    res.render('index', { 
      videoTitle: 'Dashboard',
      videoGroup: catObj,
      videoDir: 'Dashboard',	
      user:req.session.user	
      });

  }
  else {

    // User is not logged in
    res.redirect('/user/login');
  }

});


router.get('/dataloader',(req,res,next)=>{
  subjects = fs.readdirSync(videosPath);
  
  subjects.forEach(folder => {
    
    // First check the folder if it exists on the collection, before inserting
    subjectsData.findOne({name:folder}, (err, doc)=>{
      if(err) throw err;
      if(doc){
        // Folder already exists in the collection, so do nothing
        res.send('data already in database');
      }else{
        var item = {
          name: folder
        }

        // subjects to dcollection
        var subject = new subjectsData(item);
        subject.save();

        res.send('Data Loaded successfully');
      }
    })
  });

})

function getName(txt) {
  var url = txt.split('/');
  var name = url[1];
  return name;
}

function getCategory(txt) {
  var url = txt.split('/');
  var name = url[0];
  return name;
}


function convertToThumbnail(fileElements, video) {
  splitpath = video.split(".");
  snapshot = splitpath[0];

  pathToFile = path.join(__dirname, "videos", fileElements, video);
  pathToSnapshot = path.join(__dirname, "thumbnails", `${snapshot}.jpg`);

  // Also a default node module
  require('child_process').exec(('ffmpeg -ss 00:00:25 -i ' + pathToFile + ' -vframes 1 -q:v 2 ' + pathToSnapshot), function () {
    console.log('Saved the thumb to:', pathToSnapshot);

  });
}

module.exports = router;

