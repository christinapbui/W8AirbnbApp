// this is diff from user controller bc you can login/logout, login w/another account (GitHub, Google,FB)
// userController can disable account, update profile, etc.
const User = require("../models/user") // class will start with capital letter
const catchAsync = require("../utils/catchAsync")

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