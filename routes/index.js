const router = require('express').Router();
const auth = require('../middlewares/authJwt');

router.get('/', (req, res) => {
    res.json({
        version: 1
    })
})

router.use('/auth', require('./auth'));
router.use('/me', auth, require('./me'));
router.use('/projects', auth, require('./projects'));

module.exports = router;
