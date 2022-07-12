require('dotenv').config()

var mongoose = require('mongoose')
var User = require('../models/User.js')
var express = require('express');
var router = express.Router();
var { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var JWT_SECRET = process.env.JWT_SECRET

// ROUTE 1
// CREATING A USER 
// POST TYPE /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 2 }),
    body('username', 'Enter a valid name').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 8 }),
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let useremail = await User.findOne({ email: req.body.email });
        let nameuser = await User.findOne({ username: req.body.username });

        // checking if username or email are unique or not
        if (nameuser) {
            return res.status(400).json({ success, error: "Username is already taken." })
        } else if (useremail) {
            return res.status(400).json({ success, error: "User already exists with given email." })
        } else {

            // Encrypting password
            var salt = await bcrypt.genSaltSync(10);
            let secPass = await bcrypt.hash(req.body.password, salt);

            let user = await User.create({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: secPass,
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authToken })

        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error Occured.")
    }

})

// ROUTE 2
// LOGGING IN A USER 
// POST TYPE /api/auth/login
router.post('/login', [
    body('username', 'Cannot be blank').exists(),
    body('password', 'Cannot be blank').exists(),
], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { username, password } = req.body;

    try {

        // checking if username or email are unique or not
        let user = await User.findOne({ username });
        if (!user) {
            success = false;
            return res.status(500).json({ "error": "Credentials are Wrong. Please try again" });
        } else {

            // Validating password
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false;
                return res.status(500).json({ "error": "Credentials are Wrong. Please try again" });
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authToken })

        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Error Occured.")
    }

})


module.exports = router