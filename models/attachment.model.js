const mongoose = require('mongoose');
const {Schema} = mongoose;
const Project = require('./project.model');

const taskSchema = new Schema({
    admin: String,
    file: String,
    type: String,
}, {timestamps: true})

module.exports = Attachment = mongoose.model('Attachment', taskSchema);
