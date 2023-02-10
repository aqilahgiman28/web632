const router = require('express').Router();
const User = require('../models/user.model');
const Member = require('../models/member.model');
const Task = require('../models/tasks.model');
const Project = require('../models/project.model');

router.post('/', async (req, res, next) => {
    try {
        const {name, password, address, mobile} = req.body;

        if (!name || !password || !address || !mobile) {
            return res.status(403).json({
                message: 'Please fill in the blanks.'
            })
        }

        await User.findByIdAndUpdate(req.user.id, {
            name,
            password,
            address,
            mobile
        })

        res.json({
            message: 'Profile has been updated successfully'
        })
    } catch (err) {
        next(err)
    }
})

router.get('/members', async (req, res, next) => {
    try {
        const user = await User.findById(req.query.id);

        if (!user) {
            return res.status(404).json({
                message: 'Resource not found'
            })
        }

        const members = await Member.find({
            admin: user.email
        })

        res.json({
            data: members
        })
    } catch (err) {
        next(err)
    }
})

router.get('/projects', async (req, res, next) => {
    try {
        const projects = await Project.aggregate([{
            "$lookup": {
                "from": "members",
                "localField": "members",
                "foreignField": "_id", // <-- reference field from country collection
                "as": "resultingArray"
            }
        }, {"$match": {"resultingArray.email": req.user.email}}])

        res.json({
            data: projects
        })
    } catch (err) {
        next(err)
    }
})

router.get('/tasks', async (req, res, next) => {
    try {
        const user = await User.findById(req.body.id);

        if (!user) {
            return res.status(404).json({
                message: 'Resource not found'
            })
        }

        const tasks = await Task.find({
            admin: user.email
        })

        res.json({
            data: tasks
        })
    } catch (err) {
        next(err)
    }
})


module.exports = router;
