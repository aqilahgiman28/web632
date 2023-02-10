const router = require('express').Router({mergeParams: true});
const Project = require('../models/project.model');
const Task = require('../models/tasks.model');

/**
 * GET ALL TASKS FOR A PROJECT
 * GET /projects/:id/tasks/me
 */
router.get('/me', async (req, res, next) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id).populate({
            path: 'tasks',
            match: {
                email: req.user.email,
                status: 'ongoing'
            }
        });

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        res.json({
            data: project
        })
    } catch (err) {
        next(err)
    }
});

/**
 * GET ALL TASKS FOR A PROJECT
 * GET /projects/:id/tasks
 */
router.get('/', async (req, res, next) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id).populate('tasks');

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        res.json({
            data: project.tasks
        })
    } catch (err) {
        next(err)
    }
});

/**
 * ADD TASK FOR A PROJECT
 * POST /projects/:id/tasks
 */
router.post('/', async (req, res, next) => {
    try {
        const {admin, email, deadline, description} = req.body;

        const {id} = req.params;

        const project = await Project.findOne({
            id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        const task = await Task.create({
            admin,
            email,
            deadline,
            description,
            status: 'ongoing'
        })

        if (!task) {
            return res.status(500).json({
                message: 'Failed to create task.'
            })
        }

        await Project.findByIdAndUpdate(id, {
            "$push": {
                "tasks": task.id
            }
        })

        res.json({
            message: 'Task has been successfully added.'
        })

    } catch (err) {
        next(err)
    }
})


/**
 * UPDATE A TASK FOR A PROJECT
 * POST /projects/:id/tasks/:task_id
 */
router.post('/:task_id', async (req, res, next) => {
    try {
        const {task_id} = req.params;

        const task = await Task.findByIdAndUpdate(task_id, {
            ...req.body
        })

        if (!task) {
            return res.status(500).json({
                message: 'Failed to update task.'
            })
        }

        res.json({
            message: 'Task has been successfully updated.'
        })

    } catch (err) {
        next(err)
    }
})

/**
 * DELETE TASK FOR A PROJECT
 * DELETE /projects/:id/tasks/:task_id
 */
router.delete('/:task_id', async (req, res, next) => {
    try {
        const {id, task_id} = req.params;

        const task = await Task.findByIdAndDelete(task_id);

        if (!task) {
            return res.status(404).json({
                message: `No task with id: ${task_id}.`
            })
        }

        res.json({
            message: 'Task has been successfully deleted.'
        })

    } catch (err) {
        next(err)
    }
})

module.exports = router;
