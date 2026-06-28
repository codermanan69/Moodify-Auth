const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "tokes is required for blacklisting"],
    } 

}  ,{
        timestamps: true
    }
)

const blacklistModel = mongoose.model("blacklistedtokens",blacklistSchema)

module.exports = blacklistModel; 