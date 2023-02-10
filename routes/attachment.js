const router = require('express').Router({mergeParams: true});
const Project = require('../models/project.model');
const Attachment = require('../models/attachment.model');

/**
 * GET ALL ATTACHMENT FOR A PROJECT
 * GET /projects/:id/attachments
 */
router.get('/', async (req, res, next) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id).populate('attachments');

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        res.json({
            data: project.attachments
        })
    } catch (err) {
        next(err)
    }
});

/**
 * ADD ATTACHMENT FOR A PROJECT
 * POST /projects/:id/attachments
 */
router.post('/', async (req, res, next) => {
    try {
        const {admin, file, type} = req.body;
        const {id} = req.params;

        const project = await Project.findOne({
            id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        const attachment = await Attachment.create({
            admin,
            file,
            type
        })

        if (!attachment) {
            return res.status(500).json({
                message: 'Failed to create attachment.'
            })
        }

        await Project.findByIdAndUpdate(id, {
            "$push": {
                "attachments": attachment.id
            }
        })

        res.json({
            message: 'Attachment has been successfully added.'
        })

    } catch (err) {
        next(err)
    }
})

/**
 * DELETE ATTACHMENT FOR A PROJECT
 * DELETE /projects/:id/attachments/:attachment_id
 */
router.delete('/:attachment_id', async (req, res, next) => {
    try {
        const {id, attachment_id} = req.params;

        const attachment = await Attachment.findByIdAndDelete(attachment_id);

        if (!attachment) {
            return res.status(404).json({
                message: `No attachment with id: ${attachment_id}.`
            })
        }

        await Project.findByIdAndUpdate(id, {
            "$pull": {
                "attachments": attachment.id
            }
        })

        res.json({
            message: 'Attachment has been successfully deleted.'
        })

    } catch (err) {
        next(err)
    }
})

module.exports = router;
