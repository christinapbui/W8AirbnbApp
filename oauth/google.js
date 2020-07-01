var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passportGoogle = require("passport-google-oauth20")
// const Strategy = passportGoogle.Strategy
require("dotenv").config()
 
module.exports = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, next){ // accessToken received from Facebook
    console.log(profile);
    next(null, profile);
  }
);