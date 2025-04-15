const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, password1, password2 } = req.body;
        if (password1 !== password2) {
            console.log("The passwords you entered do not match.");
            res.status(400).json({ ok: false, message: 'The passwords you entered do not match' });
        }
        else {
            const pswd = await bcrypt.hash(password1, 10);
            const user = new User({
                username: username,
                passwordHash: pswd
            });
            await user.save();
            res.status(201).json({ ok: true, message: 'User registered successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
}
router.post('/register', register);

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ ok: false, message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (match) {
            const token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,       // prevents JS from reading the cookie
                secure: false,        // allow HTTP
                sameSite: 'Strict',   // cookie is sent only to the same site
                maxAge: 3600000 * 24  // 1 day
            });

            res.status(200).json({ ok: true, message: 'User logged in successfully' });
        } else {
            console.log("Invalid password");
            res.status(401).json({ ok: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
}
router.post('/login', login);

const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.status(200).json({ ok: true, message: 'User logged out successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
};
router.post('/logout', logout);

module.exports = router;