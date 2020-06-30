const mongoose = require("mongoose");
// const Tag = require("./tag")
const Experience = require("./experience")

const reviewSchema = new mongoose.Schema({
    reviewofExp: {
        type: mongoose.Schema.ObjectId,
        ref: "Experience", // refers to Experience model
        required: [true, "Please select an Experience to review!"]
    },
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
    rating: {
        type: Number,
        required: [true, "Review needs a rating"],
        min: 1,
        max: 5
    },
    user: { // reference this field to the user
        type: mongoose.Schema.ObjectId,
        ref: "User", // references User model
        required: [true, "Review must have a user"]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// calculate average & num of ratings
reviewSchema.statics.calculateAverage = async function(eid){
    // "this" refers to Review model 
    const stats = await this.aggregate([
        {
            $match: { experience: eid } // kind of like filter
        },
        {
            $group: {
                _id: "$experience",
                // number of ratings & averaage ratings
                numRating: { $sum: 1 },
                avgRating: { $avg: "$rating" }
            }
        }
    ])
    await Experience.findByIdAndUpdate(eid, {
        numRating: stats.length > 0 ? stats[0].numRating : 0,
        avgRating: stats.length > 0 ? stats[0].avgRating: 0
    })
    console.log(stats)
}

// middleware for post(save)
reviewSchema.post("save", async function(){
    // will review the document
    await this.constructor.calculateAverage(this.experience) // this.experience will catch the "eid" from the calculateAverage function
})

//query middleware to trigger findOneAnd... (pre)
reviewSchema.pre(/^findOneAnd/, async function() {
    // "this" ==== Review.query
    this.doc = await this.findOne()
    if(!this.doc){
        next(new AppError(404, "Doc not found"))
    }
    return next()
    
})

//query middleware to trigger findOneAnd... (post)
reviewSchema.post(/^findOneAnd/, async function() { // findOneAnd does not work for delete 
    // "this" ==== Review.query

    // this.constructor ==== Review model
    await this.doc.constructor.calculateAverage(this.doc.experience)
})


module.exports = mongoose.model("Review", reviewSchema)