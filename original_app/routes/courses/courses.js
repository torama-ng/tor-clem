const express = require('express');
const router = express.Router();
const session = require('express-session');


router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));

//get the subjects collections
var subjectData = require('../../collections/subjects');


router.get('/:course', (req,res,next)=>{
    var course = req.params.course;
    if(req.session.user){

        if(course == "all"){
            subjectData.find({},(err,doc)=>{
                if(err) throw err;

                res.render('courses',{
                    user: req.session.user,
                    data: doc
                });

            });
        }else{
            subjectData.find({name:course},(err,doc)=>{
                if(err) throw err;

                res.render('courses',{
                    user: req.session.user,
                    data: doc
                });

            });
        }

    }else{
        res.redirect('/user/login');
    }

});



router.post('/finder', (req,res,next)=>{
    var text = req.body.search;
    if(req.session.user){

            subjectData.find({"courses.url":{"$regex":text}},(err,doc)=>{
                if(err) throw err;

                res.render('courses',{
                    user: req.session.user,
                    data: doc
                });

            });

    }else{
        res.redirect('/user/login');
    }

});



module.exports = router;