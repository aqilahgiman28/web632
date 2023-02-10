const mongoose = require('mongoose');
const {Schema} = mongoose;
const Project = require('./project.model');

const taskSchema = new Schema({
    admin: String,
    email: String,
    deadline: String,
    creationdate: String,
    description: String,
    status: String,
}, {timestamps: true})

taskSchema.pre('remove', function (next) {
    Project.update(
        {tasks: this._id},
        {$pull: {tasks: this._id}},
        {multi: true}
    ).exec();
    next();
})

module.exports = Task = mongoose.model('Task', taskSchema);
