const express = require('express');
const router = express.Router();
const session = require('express-session');


router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));

const allVideos = require('../randomfilepicker');
var videosSync = [];

videosSync = allVideos.findVideos('videos');


router.get('/', (req, res, next) => {
    if (req.session.user) {
        var url = videosSync[1];
        res.render('recommended', {
            videoTitle: 'All Videos',
            videoFiles: videosSync,
            videoDir: 'All Videos',
            recommended: url,
            user: req.session.user
        });
    }else{
        res.redirect('/user/login');
    }

});


module.exports = router;