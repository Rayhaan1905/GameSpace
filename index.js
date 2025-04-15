const express = require("express");
require("dotenv").config();
const connectDB = require('./db/db');
const path = require("path");
const authRoutes = require('./controllers/authController');
const cookieParser = require('cookie-parser');

const app = express();

connectDB();
app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "index.html"))
});

app.get("/login",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "login.html"))
});

app.get("/registration",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "registration.html"))
});

app.get("/contact",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "contact.html"))
});

app.get("/about",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "about.html"))
});

app.get("/home",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "home.html"))
});

app.get("/privacy",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "privacy.html"))
});

app.get("/changepassword",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "changePassword.html"));
});

app.get("/game2",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "game2.html"))
});



app.use("/backend",authRoutes);

app.listen(3000, ()=>console.log("Server started"));
