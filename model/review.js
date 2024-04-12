const mongoose = require("mongoose")

const reviewScheme = new mongoose.Schema({
    
    rating:Number,
    title:String,
    userId:String,
    content:String,
    movieId:String,
    author:String
    
},{
    timestamps: true
})

const reviewModel = mongoose.model("Reviews", reviewScheme)
module.exports =  reviewModel