const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: [ true, "Username is required"],
        unique : [true , "Usernma emust be unique"]
    },
    email : {
        type : String,
        required: [ true, "Email is required"],
        unique : [true , "Email must be unique"]
    },
    password : {
        type : String,
        required: [ true, "Password is required"],
        select : false
    }
})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;