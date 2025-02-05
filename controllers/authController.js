const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

const register = async (req, res) => {
    try {
        const {username, password1,password2}= req.body;
        if(password1 !== password2)
        {
            console.log("The passwords you entered do not match.");
            res.status(400).json({ok: false, message:'The passwords you entered do not match'});
        }
        else{
            const pswd = await bcrypt.hash(password1,10);
            const user = new User({
                username: username,
                passwordHash: pswd
            });
            await user.save();
            res.status(201).json({ok: true, message: 'User registered successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ok: false, message: 'Internal server error'});
    }
}


router.post('/register', register);


module.exports = router;