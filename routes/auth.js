const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const User = require('../models/user.model');

/**
 * LOGIN
 * POST /auth/login
 */
router.post('/login', async (req, res, next) => {
    try {
        let {email, pass} = req.body;

        if (!email || !pass) {
            res.status(403).json({
                message: 'Email and password is required.'
            })
        }

        email = email.toLowerCase();

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: 'Email does not exists.'
            })
        }

        // const isValidPassword = bcrypt.compareSync(pass, user.password);

        if (pass.trim() != user.password) {
            return res.status(401).json({
                message: 'Password is invalid.'
            })
        }

        const token = jwt.sign({user: { id: user.id, email: user.email }}, config.secret, {
            expiresIn: 86400 // 24 hours
        })

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            address: user.address,
            mobile: user.mobile,
            token: token
        })

    } catch (err) {
        next(err)
    }
})

/**
 * REGISTER
 * POST /auth/register
 */
router.post('/register', async(req, res, next) => {
    try {
        let {email, pass, name, address, mobile} = req.body;

        if (!email) {
            return res.status(403).json({
                message: 'Email is required'
            })
        }

        if (!pass) {
            return res.status(403).json({
                message: 'Password is required'
            })
        }

        if (!name) {
            return res.status(403).json({
                message: 'Name is required'
            })
        }

        if (!address) {
            return res.status(403).json({
                message: 'Address is required'
            })
        }

        if (!mobile) {
            return res.status(403).json({
                message: 'Mobile is required'
            })
        }

        const userExist = await User.exists({
            email
        });

        if (userExist) {
            return res.status(403).json({
                message: 'Email already exists'
            })
        }

        const phoneExist = await User.exists({
            mobile
        });

        if (phoneExist) {
            return res.status(403).json({
                message: 'Mobile number already exists'
            })
        }

        email = email.toLowerCase();

        // const hashedPassword = bcrypt.hashSync(pass, config.saltRounds)
        const hashedPassword = pass.trim();

        const user = new User({
            name,
            email,
            address,
            mobile,
            password: hashedPassword,
        })

        let saveUser = await user.save();

        if (!saveUser) {
            return res.status(500).json({
                message: 'Failed to create user'
            })
        }

        res.json({
            success: true
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router;
