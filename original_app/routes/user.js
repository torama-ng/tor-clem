const express = require('express');
var fileUpload = require('express-fileupload');
const router = express.Router();
const fs = require('fs');
const session = require('express-session');

router.use(session({ secret: "_ajjvnjjcbvhbhvLiveNow", resave: false, saveUninitialized: true }));


// Load and call the user collections from the collections folder
const userData = require('../collections/user');

const videoData = require('../collections/videos');

// Encryption 
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');


// mkdir if not exits
const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}



router.use(fileUpload());
//router.use(sendgrid());

/*

The user sign up page is rendered

*/

router.get('/sign_up', function (req, response, next) {
    if (req.session.user) {
        response.render("already_logged_in", {
            userData: req.session.user,
            user: req.session.user
        });
    } else {
        response.render('user_sign_up', {
            regText: 'Register Now',
            user: ""
        });
    }
});



/*

User login page is rendered

*/
router.get('/login', (req, res, next) => {
    if (req.session.user) {
        res.render("already_logged_in", {
            userData: req.session.user,
            user: req.session.user
        });
    } else {
        videoData.find({}).limit(3).exec(function (err, doc) {
            if (err) throw err;
            res.render('login', {
                user: "",
                videoFiles: doc
            });

        });

    }

});

router.get('/login_start', (req, res, next) => {
    if (req.session.user) {
        res.render("already_logged_in", {
            userData: req.session.user,
            user: req.session.user
        });
    } else {
        res.render('login2', {
            user: ""
        });

    }

});


/*

When user is logged in, his profile is shown

*/
router.get('/profile', (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.image) {
            res.render('loggedin_view', {
                userData: req.session.user,
                token: "token____urhfhdvhbhvbhbhbbmn",
                user: req.session.user
            });
        } else {
            res.render('loggedin_view', {
                userData: req.session.user,
                token: "token____urhfhdvhbhvbhbhbbmn",
                user: ""
            })

        }
    } else {
        res.redirect('/user/login');
    }
})




/*
Listening for Sign up post request 
*/
router.post('/sign_up', (req, res, next) => {

    var password = req.body.password;
    const encryptedPword = cryptr.encrypt(password);

    var items = {
        name: req.body.username,
        phone: req.body.phone,
        email: req.body.email,
        password: encryptedPword
    }


    //Make the dir if not exists
    mkdirSync("profile_pics/user_images/");

    userData.findOne({ email: req.body.email }, (err, doc) => {
        if (err) throw err;
        if (doc) {
            console.log(doc);
            res.render("forgot_password", {
                userData: items,
                error: "User with this email already exists"
            });
        } else {
            var data = new userData(items);
            data.save();

            res.render('signedup_view', {
                username: data.name,
                password: password,
                user: ""
            })
        }
    });


    // var helper = require('sendgrid').mail;
    // var fromEmail = new helper.Email('info@torama.ng');
    // var toEmail = new helper.Email('ctonclem@gmail.com');
    // var subject = 'Sending with SendGrid is Fun';
    // var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
    // var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    // var sg = require('sendgrid')("tonclem");
    // var request = sg.emptyRequest({
    //     method: 'POST',
    //     path: '/v3/mail/send',
    //     body: mail.toJSON()
    // });

    // sg.API(request, function (error, response) {
    //     if (error) {
    //         console.log('Error response received');
    //     }
    //     console.log(response.statusCode);
    //     console.log(response.body);
    //     console.log(response.headers);
    // });


});

/*

Post request for login

*/
router.post('/login', (req, res, next) => {


    var email = req.body.email;
    var password = req.body.password;



        console.log(password);
        userData.findOne({ email: email }, (err, doc) => {
            if (err) {
                // Email is not found in database
                res.render('email_not_found', {
                    error: 'User with the provided email, not found',
                    user: ""
                })
                console.log('No Value found that matches');

            } else {
                var user_password = doc.password;
                var decryptedPword = cryptr.decrypt(user_password);

                if (decryptedPword === password) {
                    // provided password matches
                    req.session.user = doc;

                    res.render('loggedin_view', {
                        userData: req.session.user,
                        token: "token____urhfhdvhbhvbhbhbbmn",
                        user: doc
                    });
                } else {

                    // Email is found but password does not match users input
                    console.log('Password not correct');

                    res.render('forgot_password', {
                        userData: doc,
                        error: 'Wrong Password, Forgot your password?',
                        user: ""
                    })

                }

            }

        });
    
})

/*

The user can upload a profile image and change it at request

*/
router.post('/upload_image', (req, res, next) => {
    if (req.session.user) {
        if (req.files) {

            if (req.files.image) {
                var images = req.files.image, filename = images.name;

                images.mv('profile_pics/user_images/' + filename, (err) => {
                    if (err) throw err;
                    userData.findOne({ email: req.session.user.email }, (error, doc) => {
                        if (error) throw error;

                        doc.name = req.session.user.name;
                        doc.email = req.session.user.email;
                        doc.password = req.session.user.password;
                        doc.phone = req.session.user.phone;
                        doc.image = 'user_images/' + filename;

                        doc.save();
                        req.session.user = doc;
                        res.render('loggedin_view', {
                            userData: doc,
                            token: "token____urhfhdvhbhvbhbhbbmn",
                            user: doc
                        });

                    })
                })
            } else {
                res.redirect('/user/profile');
            }
        } else {
            res.redirect('/user/login');
        }
    }
});

/*
User logout request
*/

router.get('/logout', (req, res, next) => {
    if (req.session.user) {
        req.session.destroy((err) => {
            if (err) throw err;
        })
        res.redirect('/');
    } else {
        res.redirect('/user/login');
    }
});

// Render the user creating playlist view
router.get('/create_playlist', (req, res, next) => {
    if (req.session.user) {
        res.render('create_playlist', {
            user: req.session.user
        })
    } else { res.redirect('/user/login'); }
});



router.post('/create_playlist', (req, res, next) => {
    if (req.session.user) {

        if (req.files) {
            var videofile = req.files.video, filename = videofile.name;

            var vid_name = req.body.vid_name;
            var vid_duration = req.body.vid_duration;
            var vid_views = 0;
            var vid_url = "/upload/" + filename;


            videofile.mv('videos/upload/' + filename, (error) => {
                if (error) throw error;

                var vids = {
                    vid_name: vid_name,
                    vid_duration: vid_duration,
                    vid_url: vid_url,
                    vid_views: vid_views,
                    vid_thumbnail: "",
                    vid_category: "",
                    vid_uploader: req.session.email
                };

                var data = new videoData(vids);
                data.save();

                res.redirect('/user/user_playlist');
            })

        } else {
            // Request is not a file 

        }

    } else {
        res.redirect('/user/login');
    }

});

router.get('/user_playlist', (req, res, next) => {
    if (req.session.user) {
        videoData.find({ vid_uploader: req.session.user.email }, (err, doc) => {
            if (err) throw error;
            //Check if user have added videos to playlist
            var playlist = doc;
            if (playlist.length == 0) {
                console.log('Nothing in playlist');
                res.redirect('/user/create_playlist');
            } else {


                res.render('user_playlist', {
                    list: doc,
                    user: req.session.user
                })
            }
        });
    } else {
        res.redirect('/user/login');
    }
});


module.exports = router;