const Exp = require("../models/experience")
const Tag = require("../models/tag")
const {deleteOne, updateOne} = require("./handlerFactory")
const catchAsync = require("../utils/catchAsync")
const AppError = require("..//utils/AppError")

exports.getExperiences = catchAsync (async (req, res, next) => {
    const filters = { ...req.query };
    const paginationKeys = ["limit", "page", "sort"];
    paginationKeys.map(el => delete filters[el]);
    console.log(filters) 

    const page = req.query.page * 1 || 1; // *1 is to convert string to integer
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;
    let query = Exp.find(filters)

    query = query.skip(skip).limit(limit)

    const countExperiences = await Exp.find(filters).countDocuments()
    if (req.query.page && skip > countExperiences)
      return next(new AppError(400, "Page number out of range"))

    if (req.query.sort){
        query.sort(req.query.sort)
    }
    const exps = await query.sort(req.query.sort);

    res.json({
        status: "success",
        data: exps,
        count: countExperiences 
    })
})

exports.createExperiences = catchAsync(async (req, res, next) => {
        const {title, description, tags} = req.body
        if(!title || !description || !tags){
            return next(new AppError(400, "title, description, and tags are required"))
        }

        // 1. right now, tags is an array of string. we need to convert it to an array of objectIds
        // 2. if a tag exists in tags collection, then we will use the associated id an objectId 
        // 3. else we need to create that tag document in the collection first, then return the id => go to experience model
        // const exp = new Exp({ 
        //     title, 
        //     description, 
        //     tags,
        //     host: req.user._id 
        // })
        // await exp.save()

        const newArray = await Tag.convertToObject(tags)
        
        const exp =  await Exp.create({ 
            title, 
            description, 
            tags: newArray,
            host: req.user._id 
        })

        res.status(201).json({ // 201 means new thing created
            status: "exp created successfully!",
            data: exp
        }) 
})

exports.deleteExperience = deleteOne(Exp)
exports.updateExperience = updateOne(Exp)