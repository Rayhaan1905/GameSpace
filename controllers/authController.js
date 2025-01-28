const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const router = express.Router();

const register = async (req, res) => {
    try{
        const {username, password1,password2}= req.body;
        if(password1 !== password2)
        {
            console.log("The passwords you entered do not match.");
            res.send({code :400, message:'The passwords you entered do not match'});
        }
        else{
            await bcrypt.hash(password1,10)
            .then(hash => {
                const user = new User({
                    username: username,
                    passwordHash: hash
                });
                user.save();
            })
            .catch(err=>console.error(err));

            res.send({code :69, message:'User created'});
        }
    }catch(err)
    {console.error(err);
    }
    
}


router.post('/register', register);


module.exports = router;