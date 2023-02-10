const mongoose = require('mongoose');
const {Schema} = mongoose;
const Project = require('./project.model');

const taskSchema = new Schema({
    admin: String,
    email: String,
    username: String,
}, {timestamps: true})

module.exports = Member = mongoose.model('Member', taskSchema);
