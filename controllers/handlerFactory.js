const Tag = require("../models/tag")
const catchAsync = require("../utils/catchAsync")
const AppError = require("..//utils/AppError")

exports.deleteOne = Model => catchAsync(async (req, res, next) => { // Model is an argument, which returns another function // (which document you want to delete the Model from)

    let filterObj = {}
    if (Model.modelName === "Exp") { // defined modelName in model Object ("Tag", "Exp", "Review")
        filterObj._id = req.params.eid;
        filterObj.host = req.user._id
    } else if (Model.modelName === "Review") {
        filterObj._id = req.params.rid;
        filterObj.user = req.user._id
    }
    const doc = await Model.findOneAndDelete(filterObj)
    if (!doc) return next(new AppError(404, "No doc found"))

    res.status(204).end() // have to have this line; otherwise, won't see any response from Postman

})

exports.updateOne = Model => catchAsync(async (req, res, next) => {
        // const {title, description} = req.body; // if we only have a couple of fields to import
        let filterObj = {}
        let allows = []

        if (Model.modelName === "Experience") { // defined modelName in model Object ("Tag", "Exp", "Review")
            filterObj._id = req.params.eid;
            filterObj.host = req.user._id
            allows = ['title', 'description', 'tags']
            if (req.body.tags) {
                req.body.tags = await Tag.convertToObject(req.body.tags)
            }
        } else if (Model.modelName === "Review") {
            filterObj._id = req.params.rid;
            filterObj.user = req.user._id
            allows = ['rating', 'review']
        }
        const doc = await Model.findOne(filterObj)
        if (!doc) return res.status(404).json({ status: "fail", message: "No document found" })

        // modify data here dynamically
        // const allows = ['title', 'description', 'tags']

        // change the value of properties in doc according to the allowed array
        for (const key in req.body) {
            if (!allows.includes(key)) {
                doc[key] = req.body[key]
            }
        }

        await doc.save();

        res.status(200).json({ status: "Updated successfully", data: doc });

})