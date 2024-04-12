const mongoose = require("mongoose")

const AccountSchema = new mongoose.Schema({
    username: String,
    email: String,
    password : String
})

const AccountModel = mongoose.model("Accounts", AccountSchema)
module.exports = AccountModel