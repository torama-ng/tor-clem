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


const allVideos = require('../randomfilepicker');
var videosSync = [];

videosSync = allVideos.findVideos('videos');

console.log(__dirname);
/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.session.user) {

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






module.exports = router;

