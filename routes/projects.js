const router = require('express').Router();
const Project = require('../models/project.model');

/**
 * PROJECT TASKS
 * EXTENDED: TASKS
 */
router.use('/:id/attachments', require('./attachment'));
router.use('/:id/members', require('./member'));
router.use('/:id/tasks', require('./task'));

/**
 * GET ALL PROJECT
 * GET /projects
 */
router.get('/', async (req, res, next) => {
    try {
        const projects = await Project.find({
            admin: req.user.email
        }).sort({ createdAt: 'desc' });

        res.json({
            data: projects
        })
    } catch (err) {
        next(err)
    }
});

/**
 * ADD PROJECT
 * POST /projects
 */
router.post('/', async (req, res, next) => {
    try {
        const {name, description} = req.body;

        if (!name) {
            return res.status(403).json({
                message: 'Name is required.',
            })
        }

        if (!description) {
            return res.status(403).json({
                message: 'Description is required.',
            })
        }

        const project = new Project({
            projectname: name,
            description: description,
            creationdate: new Date(),
            admin: req.user.email
        })

        await project.save();

        res.json({
            data: []
        })
    } catch (err) {
        next(err)
    }
});

/**
 * DELETE PROJECT
 * DELETE /projects/:id
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.status(403).json({
                message: 'Project ID is required.'
            })
        }

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                message: `No project with id: ${id}`
            })
        }

        res.json({
            project,
            message: `Project with id: ${id} deleted successfully.`
        })
    } catch (err) {
        next(err)
    }
});

module.exports = router;
