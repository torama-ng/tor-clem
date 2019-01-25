const express = require('express');
const router = express.Router();
const session = require('express-session');

router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));

// Load and call the user collections from the collections folder
const videoData = require('../collections/videos');
const videoData2 = require('../collections/videos');

// viewer collection is loaded
const viewerData = require('../collections/viewers');


router.get('/view/:folder/:name/:_id', (req, res, next) => {
    var folder = req.params.folder;
    var name = req.params.name;
    var id = req.params._id;
    list = [];
    var currentView;
    videoData2.findOne({ vid_url: folder + "/" + name }, (err, vids) => {
        if (err) throw err;
        if (vids) {

            currentView = vids.vid_views;
            if (vids.vid_comments.user_name) {
                for (var i = 0; i < vids.vid_comments.user_name.length; i++) {

                    var items = {
                        user_name: vids.vid_comments.user_name[i],
                        comment: vids.vid_comments.comment[i],
                        date: vids.vid_comments.date[i]

                    }
                    list.push(items);

                }
                console.log("list  -===////= " + list);
            }
        } else {
            //Do nothing
        }
    });

    if (req.session.user) {
        var folder = req.params.folder;
        var name = req.params.name;

        var _id_vid = req.params._id;
        var url = "/" + folder + "/" + name;
        console.log("Params ->--- " + url + "/" + _id_vid);


        videoData.find({ vid_category: folder }).limit(6).exec(function (errF, foundCats) {
            if (errF) throw errF;

            viewerData.findOne({ vid_id: _id_vid, vid_viewer: req.session.user.email },
                (err, doc) => {
                    if (err) throw err;

                    if (doc) {

                        //list = [];

                        res.render('video_viewer2', {
                            vid_url: url,
                            user: req.session.user,
                            _id: _id_vid,
                            list,
                            allList: foundCats
                        });

                        return;


                    } else {

                        console.log("Nothing");

                        console.log("found --" + doc);
                        var view = {
                            vid_id: _id_vid,
                            vid_viewer: req.session.user.email
                        }

                        var views = new viewerData(view);
                        //views.save();

                        /*
                           Update the views by adding the initial views + 1

                           */
                        // videoData.findOneAndUpdate({ _id: id },
                        //     {
                        //         "vid_views": currentView + 1
                        //     },
                        //     { new: true },
                        //     (err, user) => {
                        //         if (err) throw err;
                        //         console.log(user);
                        //     });



                        res.render('video_viewer2', {
                            vid_url: url,
                            user: req.session.user,
                            _id: _id_vid,
                            list,
                            allList: foundCats
                        });
                    }
                });

        });



        // if (url) {

        //     //The below code checks if user has already viewed the particular video 
        //     viewerData.findOne({vid_id: _id, vid_viewer: req.session.user.email}, (err, Viewed) => {
        //         if (err) {console.log("CRARRAAYAY ---" +err)}
        //         if (Viewed) {
        //             //User has already viewed this video before, so do nothing.
        //             console.log(Viewed);


        //             // Find the video and get the vid_views 
        //             videoData.findOne({ _id: _id }, (errFind, doc) => {
        //                 if (errFind) throw errFind;

        //                 // Find Similar videos and limit 6
        //                 videoData.find({}).limit(6).exec(function(findErr, doc2) {
        //                     if (findErr) throw findErr;
        //                     // console.log("DOX -- "+doc2[0].vid_url);

        //                     // Loop through all the videos
        //                     allList = [];
        //                     for (var j = 0; j <doc2.length; j++) {

        //                         var vids = {
        //                             _id: doc2[j]._id,
        //                             vid_url: doc2[j].vid_url,
        //                             vid_name: doc2[j].vid_name,
        //                             vid_views: doc2[j].vid_views
        //                         }
        //                         allList.push(vids);
        //                     }

        //                     // Loop for all comments
        //                     var list = [];
        //                     if (doc.vid_comments.user_name) {
        //                         for (var i = 0; i < doc.vid_comments.user_name.length; i++) {

        //                             var items = {
        //                                 user_name: doc.vid_comments.user_name[i],
        //                                 comment: doc.vid_comments.comment[i],
        //                                 date: doc.vid_comments.date[i]

        //                             }
        //                             list.push(items);
        //                         }

        //                         res.render('video_viewer2', {
        //                             vid_url: url,
        //                             user: req.session.user,
        //                             _id: _id,
        //                             list,
        //                             allList
        //                         });

        //                     } else {
        //                         // No comments, Just Display normal
        //                         console.log("No Comments ...........")
        //                         list = [];
        //                         res.render('video_viewer2', {
        //                             vid_url: url,
        //                             user: req.session.user,
        //                             _id: _id,
        //                             list,
        //                             allList
        //                         });
        //                     }

        //                 })

        //             });
        //         } else {

        //             //Add viewer to viewer database
        //             var viewer = new viewerData({
        //                 vid_id: _id,
        //                 vid_viewer: req.session.user.email
        //             });
        //             viewer.save();

        //             // Find the video and get the vid_views 
        //             videoData.findOne({ _id: _id }, (errFind, doc) => {
        //                 if (errFind) throw errFind;

        //                 // Find Similar videos and limit 6
        //                 videoData.find({}).limit(6).exec(function(findErr,doc2){
        //                     if (findErr) throw findErr;
        //                     // console.log("DOX -- "+doc2[0].vid_url);

        //                     // Loop through all the videos
        //                     allList = [];
        //                     for (var j = 0; j < doc2.length; j++) {

        //                         var vids = {
        //                             _id: doc2[j]._id,
        //                             vid_url: doc2[j].vid_url,
        //                             vid_name: doc2[j].vid_name,
        //                             vid_views: doc2[j].vid_views

        //                         }
        //                         allList.push(vids);
        //                     }

        //                     // Loop for all comments
        //                     var list = [];
        //                     if (doc.vid_comments.user_name) {
        //                         for (var i = 0; i < doc.vid_comments.user_name.length; i++) {

        //                             var items = {
        //                                 user_name: doc.vid_comments.user_name[i],
        //                                 comment: doc.vid_comments.comment[i],
        //                                 date: doc.vid_comments.date[i]

        //                             }
        //                             list.push(items);
        //                         }

        //                         res.render('video_viewer2', {
        //                             vid_url: url,
        //                             user: req.session.user,
        //                             _id: _id,
        //                             list,
        //                             allList
        //                         });

        //                     } else {
        //                         // No comments, Just Display normal
        //                         console.log("No Comments Not Viewed...........")
        //                         list = [];
        //                         res.render('video_viewer2', {
        //                             vid_url: url,
        //                             user: req.session.user,
        //                             _id: _id,
        //                             list,
        //                             allList
        //                         });
        //                     }

        //                     /*
        //                     Update the views by adding the initial views + 1

        //                     */
        //                     videoData.findOneAndUpdate({ _id: _id },
        //                         {
        //                             "vid_views": doc.vid_views + 1
        //                         },
        //                         { new: true },
        //                         (err, user) => {
        //                             if (err) throw err;
        //                             console.log(user);
        //                         });
        //                 })

        //             });

        //         }
        //     });
        //     //End of viewer check
        // }
        // //End of url check
    }
    else {
        res.redirect('/user/login');
    }
});




router.post('/comments/:id', (req, res, next) => {

    if (req.session.user) {
        var id = req.params.id;
        var comment = req.body.comments;
        var time = new Date().toLocaleTimeString();

        var comments = {
            user_name: req.session.user.name,
            comment: comment,
            date: time
        };

        videoData.findOneAndUpdate({ _id: id },
            {
                $push: {
                    "vid_comments": comments
                }
            },
            { new: true },
            (err, user) => {
                if (err) throw err;
                console.log(user);
                res.redirect(`/viewer/view/${user.vid_url}/${user._id}`);
            }
        )

    } else {
        res.redirect('/user/login');
    }

});

router.get('/playlist/:folder/:name', (req, res, next) => {

    if (req.session.user) {
        var folder = req.params.folder;
        var name = req.params.name;
        var url = "/" + folder + "/" + name;

        res.render('playlist_viewer', {
            vid_url: url,
            user: req.session.user
        })

    } else {
        res.redirect('/user/login');
    }

});


module.exports = router;



