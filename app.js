var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser");



var databaseURL = process.env.DATABASEURL;
mongoose.connect(databaseURL);    
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));


// Create the collection
var todoSchema = new mongoose.Schema({
    content: String
});

var Todo = mongoose.model("Todo", todoSchema);
//---------------------------------------------


app.get("/", function(req, res){
    res.redirect("/todo");
});


// Index Route
app.get("/todo", function(req, res){
    Todo.find({}, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.render("index", {todo: todo});
        }
    });
});


// New Route
app.get("/todo/new", function(req, res){
    res.render("new");
});


// Create Route
app.post("/todo", function(req, res){
    console.log(req.body.todo);
    Todo.create(req.body.todo, function(err){
        if (err){
            console.log(err);
        } else {
            res.redirect("/todo");
        }
    });
});

// Edit Route
app.get("/todo/:id/edit", function(req, res){
    Todo.findById(req.params.id, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.render("edit", {todo: todo});
        }
    });
});

// Update Route
app.put("/todo/:id", function(req, res){
   Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, todo){
       if (err){
           console.log(err);
       } else {
           res.redirect("/todo");
       }
   });
});

// Destroy Route
app.delete("/todo/:id", function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.redirect("/todo");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The todo list server is now starting......");
});
