const express = require("express");
require("dotenv").config();
const User = require('./model/user');
const connectDB = require('./db/db');
const path = require("path");
const authRoutes = require('./controllers/authController');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

connectDB();
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const checklogin = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('/');
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
        res.redirect('/')
    }
}

const ifLogin = async (req, res, next) => {
    if (!req.cookies.token) {
        next();
    } else {

        try {
            const decoded = jwt.verify(req.cookies.token, process.env.SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                res.clearCookie("token");
                next();
            }

            req.user = user;
            res.redirect('/home');
        } catch (error) {
            console.error(error);
            next();
        }
    }
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "index.html"))
});

app.get("/login", ifLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "login.html"))
});

app.get("/registration", ifLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "registration.html"))
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "contact.html"))
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "about.html"))
});

app.get("/home", checklogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "home.html"))
});

app.get("/privacy", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "privacy.html"))
});

app.get("/changepassword", checklogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "changePassword.html"));
});

app.get("/game1", checklogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "game1.html"))
});

app.get("/game2", checklogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "game2.html"))
});

app.get("/game3", checklogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', "game3.html"))
});


app.use("/backend", authRoutes);

app.listen(3000, () => console.log("Server started"));
