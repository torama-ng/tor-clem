var express = require('express');
var router = express.Router();
const walk = require('../walk.js');
const session = require('express-session');


router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));


const videoData = require('../collections/videos');


/* GET home page. */
router.get('/:category', function (req, res, next) {
    if (req.session.user) {
        var category = req.params.category;

        // Listener for all videos clicked
        if(category === "all"){
            videoData.find({},(err,doc)=>{

                console.log(doc);
                if(err) throw err;
                if(doc.length != 0){
                    res.render('view2', {
                        videoTitle: `List of all videos`,
                        videoFiles: doc,
                        videoDir: category,
                        user: req.session.user
                    });
                }
                else{
                    res.render('view', {
                        videoTitle: `No videos Yet`,
                        videoFiles: doc,
                        videoDir: category,
                        user: req.session.user
                    });
                }
                })
        }else{

            // Find all other videos with categories in DB
        videoData.find({vid_category:category},(err,doc)=>{

            if(err) throw err;
            if(doc.length != 0){
                res.render('view3', {
                    videoTitle: `${category} Videos`,
                    videoFiles: doc,
                    videoDir: category,
                    user: req.session.user
                });
            }else{
                res.render('view', {
                    videoTitle: `No videos in ${category} category`,
                    videoFiles: doc,
                    videoDir: category,
                    user: req.session.user
                });
            }
        });
    }
        
    }else{
        res.redirect('/user/login');
    }
});


module.exports = router;
