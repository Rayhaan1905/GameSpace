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
            const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });

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

const middleware = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({
            ok: false,
            message: "Not authorized: No token"
        });
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            throw new Error("No userId found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            ok: false,
            message: "Not authorized: Invalid token"
        });
    }
}

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
router.post('/logout', middleware, logout);

const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        const userData = await User.findById(req.user._id);
        if (!userData) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, userData.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ ok: false, message: 'Incorrect current password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ ok: false, message: 'New password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userData.passwordHash = hashedPassword;
        await userData.save();

        res.status(200).json({ ok: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: 'Internal server error' });
    }
};
router.post('/changepassword', middleware, changePassword);

module.exports = router;