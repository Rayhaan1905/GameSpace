const express = require("express");
const app = express();
const path = require("path");


app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, 'views', "index.html"))
});
app.get("/login",(req, res)=>{
    res.send("<h1>login</h1>")
})
app.listen(()=>{console.log("Server started")});