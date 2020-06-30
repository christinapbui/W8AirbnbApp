const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    tag: { 
        type: String,
        required: [true, "tag is required"],
        unique: true,
        trim: true,
        lowercase: true
    }
})

// this whole thing checks to see if the tag exists
TagSchema.statics.convertToObject = async function(array){
 // 1. still an array of strings
    // 2. change array to objectId 
    // 3. find the tag from each string from Tag model
    let foo = array.map(async el => {
        let bar = await this.findOne({ tag: el.toLowerCase().trim() })
        if(bar)
            return bar
        bar = await this.create({ tag: el.toLowerCase().trim() })
        return bar
    })
    let result = await Promise.all(foo)
    console.log("results are",result)
    return result
    // "this.findOne" and "this.create" will return Promise
}

module.exports = mongoose.model("Tag", TagSchema)