const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    console.log('newUser = ' + newUser);
    User.addUser(newUser,(err) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register'});
        } else {
            res.json({success: true, msg: 'User registered'});
        };
    });
    //res.send('REGISTER');
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    //res.send('AUTHENTICATE');
    const username = req.body.username;
    const password = req.body.password;

    // Check the user exist
    User.getUserByUsername(username,(err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'No User Found'})
        }

        //If the user exist then compare the password
        User.comparePassword(password, user.password,(err, isMatch) => {
            if (err) throw err;
            // Password check passed
            if (isMatch) {
                // Create the token and set to expire in 1h
                const token = jwt.sign(user,config.secret,{ expiresIn: 60 * 60});
                res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                // Password check failed
                return res.json({success: false, msg: 'Wrong password'});
            }
        });

    })
});

// Profile
router.post('/profile',passport.authenticate('jwt',{session: false}) ,(req, res, next) => {
    res.json({user: req.user});
    //res.send('PROFILE');
});



module.exports = router;