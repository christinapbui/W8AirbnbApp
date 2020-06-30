const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const round = 10; // complexity of algorithm/how secure you want the password to be
const jwt = require("jsonwebtoken")

const schema = new mongoose.Schema({ // syntax to create new model
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        trim: true, // remove space in front and end
        lowercase: true,
        validate(value){ // using a library for validator
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    displayName: {
        type: String,
        required: [true, "Name is required!"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    userRole: {
        type: String,
        enum: ["normal", "host"], // cannot input any other value aside from "normal" or "host"
        required: [true, "User role is required!"],
        default: "normal"
    },
    tokens: [String] // this needs to be stored somewhere // it is an array of strings

}, {
    timestamps: true,
    toJSON: {virtuals: true}, // virtuals = there will be fields we don't store in the DB (e.g. if there's a "first name" and "last name" field, combined is "full name" field that isn't stored) // toJSON means stringify
    toObject: {virtuals: true} // create another object with the public keys / hidden keys 
})

schema.methods.toJSON = function(){
    // inside methods, `this` will refer to the instance (object inherited from class) e.g. schema is "class"
    const obj = this.toObject();
    delete obj.password; // remove field you don't want to see (e.g. password) = won't show to front-end but will still store in DB
    //delete obj.id // optional
    delete obj.tokens;
    return obj
    // when this posts to the DB, __v = version
}
// to call methods function: user.toJSON()

// generate token
schema.methods.generateToken = async function(){ // cannot use arrow function; this will become undefined if use arrow function
    // this will refer to the instance of User 
    // { _id: X, name: "khoa", email: "@gmail.com"}
    const token = jwt.sign({
        _id: this._id // "this" refers to the instance
    }, process.env.SECRET_KEY, { expiresIn: "7d" });
    this.tokens.push(token) // refers to & pushes "tokens" array above in the schema
    await this.save()
    return token // return this to attach it the response in authController

}



// diff between methods and statics: 
// example of instance: 
// class: const obj = new Class({name: "Khoa", age: 32})
// obj => {name: "Khoa", age: 32} => instance of Person class // obj is an instance because it can only be called with methods, NOT with statics
// Person.loginWithEmail()

schema.statics.loginWithEmail = async function(email, password){
    // inside statics, `this` will refer to the class
    const user = await this.findOne({email: email}) // to find user from database. remember to use "this" instead of User! ("this" refers to the class "User"). can't call User because we define it below

    if(!user){ // check to see if there's a user
        return null 
    }

    const match = await bcrypt.compare(password, user.password) // this will compare raw pw w/hashed pw. we got the "password" above (see const user). // match will be Boolean

    if(match){
        return user // if true, return user; else, return null
    }
    return null
}
//to call statics function: // User.loginWithEmail()

// this is middleware 
// you can have user.save(), user.update(), etc...
schema.pre("save", async function(next){ // this means before we save to the database, we will execute this function // next means skip to next function
    // this = the instance of User model (User object inside userController)
    console.log("this")
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, round) // add raw password and reassign value to hash
    };
    next()
}) 

// schema.post("save",function(){ // after we save to the database


module.exports = mongoose.model("User", schema)