const express = require("express");
require("dotenv").config();
const connectDB = require('./db/db');
const app = express();
const path = require("path");
const authRoutes = require('./controllers/authController');
connectDB();
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "index.html"))
});
app.get("/login",(req, res)=>{
    res.send("<h1>login</h1>")
})

app.use("/users",authRoutes);


app.listen(()=>{console.log("Server started")});
