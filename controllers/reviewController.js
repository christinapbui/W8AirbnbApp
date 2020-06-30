const User = require("../models/user")
const Experience = require("../models/experience")
const Review = require("../models/review")
const {deleteOne} = require("./handlerFactory")


// get list of users
exports.getReviewList = async (req, res, next) => {
    try {
        const reviewList = await Experience.find({}) // use this to query and get list of exp and return it // empty object unless you want to execute a certain condition
        
        res.status(200).json({ // 200 is successful code
            reviewList
        })
        
    }catch(err) {
        res.status(400).json({
            status: "failed to get list",
            error: err.message
        })
    }
}


exports.createReview = async (req, res, next) => {
    try{
        const {reviewOfExp, title, description, rating} = req.body;
        if(!reviewOfExp || !title || !description || !rating){
            return res.status(400).json({  // 400 is bad request (wrong format, not enough required arguments)
                status: "fail", 
                error: "Experience, title, description, and rating are required"
            })
        }
        const review = await Review.create({
            reviewofExp: reviewOfExp,
            title: title, 
            description: description, 
            rating: rating,
            user: req.user._id
        })
        res.status(201).json({ // 201 means new thing created
            status: "ok",
            data: review
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ 
            status: "error",
            error: err.message
        })
    }

}

exports.updateReview = async (req, res, next) => {
    try{
        const review = await Review.findOne({
            _id: req.params.rid,
            user: req.user._id
        })
        if (!review) return res.status(404).json({ status: "fail", message: "No document found" })
        
        const fields = Object.keys(req.body);
        fields.map(field => review[field] = req.body[field])
        await review.save();
        res.status(200).json({
            status: "successfully changed info",
            data: review
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ 
            status: "error",
            error: err.message
        })
    }
}

// using middleware to updateReview
// exports.updateReview = catchAsync(async (req, res, next) => {
//     const review = await Review.findOneAndUpdate(
//         { 
//             user: req.user._id,
//             _id: req.params.rid // we find the review, not the experience
//         },
//         { 
//             ...req.body,
//             user:req.user._id,
//             experience: req.params.eid,
//         },
//         {
//             new: true,
//             runValidators: true
//         }
//     )
//     res.json({ status: ok, data: review })
// })


exports.deleteReview = deleteOne(Review)