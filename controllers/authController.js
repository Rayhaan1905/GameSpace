const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const router = express.Router();

const register = async (req, res) => {
        const {username, password1,password2}= req.body;
        if(password1 !== password2)
        {
            console.log("The passwords you entered do not match.");
            res.send({code :400, message:'The passwords you entered do not match'});
        }
        else{
            const pswd = await bcrypt.hash(password1,10);
            const user = new User({
                username: username,
                passwordHash: pswd
            });
            user.save();
        }
}


router.post('/register', register);


module.exports = router;