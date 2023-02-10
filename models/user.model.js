const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    mobile: {
        type: String,
        unique: true,
    },
    is_admin: Boolean,
}, {timestamps: true})

module.exports = User = mongoose.model("User", userSchema);
