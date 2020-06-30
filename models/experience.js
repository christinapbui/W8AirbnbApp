const mongoose = require("mongoose");
const Tag = require("./tag")
const User = require("./user")

const expSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minLength: 5, // minimum length is 5 chars
        maxLength: 100,
        required: [true, "Experience must have a title!"]
    },
    description: {
        type: String,
        trim: true,
        minLength: 5, 
        maxLength: 1000,
        required: [true, "Experience must have a description!"]
    },
    host: { // reference this field to the user
        type: mongoose.Schema.ObjectId,
        ref: "User", // references User model
        required: [true, "Experience must have a host"]
    },
    tags: [{
        type: mongoose.Schema.ObjectId,
        ref: "Tag",
        required: [true, "Experience must have a tag"]
    }],
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numRating: {
        type: Number,
        default: 0
    },
    duration: { 
        type: Number, // unit in minutes
        required: [true, "You must add a duration to the experience!"]
    },
    price: {
        type: Number,
        required: [true, "Experience must have a price!"]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// middleware for save (calculate number AFTER review) = post save 


// expSchema.pre("save", async function(next){
//     let array = [...this.tags] // 1. still an array of strings
//     // 2. change array to objectId 
//     // 3. find the tag from each string from Tag model
//     let foo = array.map(async el => await Tag.findOne({
//         tag: el.toLowerCase().trim()
//     }))
//     let result = Promise.all(foo)
//     this.tags = result 
//     next()
// })

module.exports = mongoose.model("Experience", expSchema)