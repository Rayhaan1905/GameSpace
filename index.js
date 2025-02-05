const express = require("express");
require("dotenv").config();
const connectDB = require('./db/db');
const path = require("path");
const authRoutes = require('./controllers/authController');

const app = express();

connectDB();

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

app.get("/about",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "index.html"))
});

app.use("/backend",authRoutes);

app.listen(()=>console.log("Server started"));
