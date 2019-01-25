var express = require('express');
var router = express.Router();
var session = require('express-session');

router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));



var videoData = require('../collections/videos');


/* GET Search page and string. */
router.get('/',(req,res,next)=>{
    if(req.session.user){

    }else{
        res.redirect('/user/login');
    }
})


router.post('/', function (req, res, next) {

    if(req.session.user)
    {

    var search_text = req.body.search;
    console.log(search_text);

    videoData.find({ "vid_url": {'$regex': search_text}}).exec((err, doc) => {
        if (err) throw err;
        if (doc.length != 0) {
            res.render('view', {
                videoTitle: `found videos for ${search_text}`,
                videoFiles: doc,
                user: req.session.user
            });
        } else {
            
            videoData.find({},(errN,dox)=>{
                if(errN) throw errN;
                console.log(dox);
                res.render('view', {
                videoTitle: `No videos found that matches ${search_text}, see available videos below`,
                videoFiles: dox,
                user: req.session.user
            });
            })
        }
    });
}else{
      res.redirect('/user/login');
}

});




module.exports = router;
