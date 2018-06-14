var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost/todolist_new");    
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The todo list server is now starting......");
})
