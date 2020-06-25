const User = require("../models/user")


exports.createUser = async (req, res, next) => {
    try{
        const {email, displayName, password} = req.body;
        if(!email || !displayName || !password){
            return res.status(400).json({  // 400 is bad request (wrong format, not enough required arguments)
                status: "fail", 
                error: "Email, name, and password are required"
            })
        }
        const user = await User.create({email: email, displayName: displayName, password: password })
        res.status(201).json({ // 201 means new thing created
            status: "ok",
            data: user
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ 
            status: "error",
            error: err.message
        })
    }

}

exports.getMyProfile = async (req, res, next) => {
    res.json({
        status: "ok",
        data: req.user
    })
}

exports.changeInfo = async (req, res, next) => {
    try{
        const user = await User.findById(req.user._id)
        const fields = Object.keys(req.body);
        fields.map(field => user[field] = req.body[field])
        await user.save();
        res.status(200).json({
            status: "successfully changed info",
            data: user
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ 
            status: "error",
            error: err.message
        })
    }

}

exports.logout = async function (req, res) {
    try{
        const token = req.headers.authorization.replace("Bearer ","")
        req.user.tokens = req.user.tokens.filter(el => el !== token)
        await req.user.save()
        res.status(204).json({
            status: "successfully logged out",
            data: null
        })
    } catch(err){
        res.status(401).json({
            status: "failed to logout",
            message: err.message
        })
    }
}