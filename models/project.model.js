const mongoose = require('mongoose');
const {Schema} = mongoose;

const projectSchema = new Schema({
    projectname: String,
    description: String,
    admin: String,
    attachments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attachment'
        }
    ],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Member'
        }
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
}, {timestamps: true})

module.exports = Project = mongoose.model("Project", projectSchema);

