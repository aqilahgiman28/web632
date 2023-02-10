const router = require('express').Router({mergeParams: true});
const Project = require('../models/project.model');
const Member = require('../models/member.model');

/**
 * GET ALL MEMBERS FOR A PROJECT
 * GET /projects/:id/members
 */
router.get('/', async (req, res, next) => {
    try {
        const {id} = req.params;

        const project = await Project.findById(id).populate('members');

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        res.json({
            data: project.members
        })
    } catch (err) {
        next(err)
    }
});

/**
 * ADD MEMBER FOR A PROJECT
 * POST /projects/:id/members
 */
router.post('/', async (req, res, next) => {
    try {
        let {admin, email, username} = req.body;

        const {id} = req.params;

        const project = await Project.findOne({
            id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Resource not found'
            });
        }

        email = email.trim().toLowerCase();

        const member = await Member.create({
            admin,
            email,
            username,
        })

        if (!member) {
            return res.status(500).json({
                message: 'Failed to add member to project.'
            })
        }

        await Project.findByIdAndUpdate(id, {
            "$push": {
                "members": member.id
            }
        })

        res.json({
            message: 'Member has been successfully added.'
        })

    } catch (err) {
        next(err)
    }
})

/**
 * DELETE TASK FOR A PROJECT
 * DELETE /projects/:id/members/:member_id
 */
router.delete('/:member_id', async (req, res, next) => {
    try {
        const {id, member_id} = req.params;

        const member = await Member.findByIdAndDelete(member_id);

        if (!member) {
            return res.status(404).json({
                message: `No member with id: ${member_id}.`
            })
        }

        await Project.findByIdAndUpdate(id, {
            "$pull": {
                "members": member_id
            }
        })

        res.json({
            message: 'Member has been successfully deleted.'
        })

    } catch (err) {
        next(err)
    }
})

module.exports = router;
