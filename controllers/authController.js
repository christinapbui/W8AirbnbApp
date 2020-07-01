// this is diff from user controller bc you can login/logout, login w/another account (GitHub, Google,FB)
// userController can disable account, update profile, etc.
const User = require("../models/user") // class will start with capital letter
const catchAsync = require("../utils/catchAsync")
const passport = require("../oauth/index")

exports.loginWithEmail = catchAsync (async (req, res, next) => { // controller for login
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            status: "fail",
            error: "Email and password are required"
        })
    }
    const user = await User.loginWithEmail(email, password);
    if(!user){
        return res.status(401).json({
            status: "fail",
            error: "Wrong email or password"
        })
    }

    const token = await user.generateToken(); // if calling through instance, don't need to pass argument

    res.json({
        status: "ok",
        data: { user: user, token: token }
    })
    // next have to compare hashed password with raw password in DB
})

exports.logout = catchAsync(async(req, res, next) => {
    const token = req.headers.authoritzation.replace("Bearer ", "")
    console.log("token is ", token)
    req.user.tokens = req.user.tokens.filter(el => el !== token)
    res.send("ok")
    await req.user.save()
    
    res.status(204).end()
})

exports.loginFacebook = passport.authenticate("facebook", { scope: ['email'] })

exports.facebookAuthHandler = function(req, res, next) {
    passport.authenticate("facebook", async function(err, profile) {
        // if email exists in database => log in user and return token
        // else email doesn't exist, we create a new user with that email and return the token
        try {
            let email = profile._json.email
            let name = profile._json.first_name + " " + profile._json.last_name
            let user = await User.findOneOrCreate({email, name}) // find a user; if user doesn't exist, create a new user
            let token = await user.generateToken()
    
            // if user successfully logs in => redirect to frontend page
            return res.redirect(`https://localhost:3000/?token=${token}`)

        } catch (err){
            // else if there's any error => redirect to login page again
            return res.redirect('https://localhost:3000/login')
        }


    })(req, res, next);
};

exports.loginGoogle = passport.authenticate("google", { scope: ['email'] })

exports.googleAuthHandler = function(req, res, next) {
    passport.authenticate("google", async function(err, profile) {
        // if email exists in database => log in user and return token
        // else email doesn't exist, we create a new user with that email and return the token
        try {
            let email = profile._json.email
            let name = email
            // let name = profile._json.first_name + " " + profile._json.last_name
            let user = await User.findOneOrCreate({email, name}) // find a user; if user doesn't exist, create a new user
            console.log("i'm here: ",user)
            let token = await user.generateToken()
            console.log("checking token: ", token)
    
            // if user successfully logs in => redirect to frontend page
            return res.redirect(`https://localhost:3000/?token=${token}`)

        } catch (err){
            console.log("error is here: ",err)
            // else if there's any error => redirect to login page again
            return res.redirect('https://localhost:3000/login')
        }


    })(req, res, next);
};