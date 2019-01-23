const express = require('express');
const router = express.Router();

var authFile = require("../facebook_config/auth")

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;


// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/facebook', passport.authenticate('facebook',{scope:"email"}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
    }));


router.get('/profile',(req,res,next)=>{
    res.render("facebook_logged_in");
});

passport.use(new FacebookStrategy({
    clientID: authFile.facebookAuth.clientID,
    clientSecret: authFile.facebookAuth.clientSecret,
    callbackURL: authFile.facebookAuth.callbackURL
},
    function (accessToken, refreshToken, profile, done) {
        var items = {
            id: profile.id,
            name :profile.name.givenName + " - " + profile.name.familyName,
            username:profile.username,
            email: profile.emails[0].value
        }

        console.log(items);
        done(null,items);
    }
));

module.exports = router;


