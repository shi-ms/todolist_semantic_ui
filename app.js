var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    passportLocalMongoose = require("passport-local-mongoose");
    


//-------------Setting database----------------------
var databaseURL = process.env.DATABASEURL;
mongoose.connect(databaseURL);

//mongoose.connect("mongodb://localhost/todolist_new");
//---------------------------------------------------

//----------------------------------------Model Setting-------------------------
// User model 
var userSchema = new mongoose.Schema({
    username:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);
//-----------

// Todolist Model
var todoSchema = new mongoose.Schema({
    content: String,
    currentUser: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
});

var Todo = mongoose.model("Todo", todoSchema);
//---------------------------------------------------------------------------

//-------------App Configuration--------------------
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSession({
    secret: "This is for rui to use!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    //res.locals.error = req.flash("error");
    //res.locals.success = req.flash("success");
    next();
});
//---------------------------------------------------



//PASSPORT CONFIGURATION
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//------------------------------------------------------




// Home Route
app.get("/", function(req, res){
    res.render("landing");
});


// Index Route
app.get("/todo",isLoggedIn,function(req, res){
    Todo.find({"currentUser.id":req.user._id}, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.render("index", {todo: todo});
        }
    });
});


// New Route
app.get("/todo/new",isLoggedIn,function(req, res){
    res.render("new");
});


// Create Route
app.post("/todo",isLoggedIn, function(req, res){
    var user = {id:req.user._id, username:req.user.username};
    var newTodo = {content: req.body.content, currentUser:user};
    Todo.create(newTodo, function(err){
        if (err){
            console.log(err);
        } else {
            res.redirect("/todo");
        }
    });
});

// Edit Route
app.get("/todo/:id/edit",isLoggedIn, function(req, res){
    Todo.findById(req.params.id, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.render("edit", {todo: todo});
        }
    });
});

// Update Route
app.put("/todo/:id",isLoggedIn,function(req, res){
   Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, todo){
       if (err){
           console.log(err);
       } else {
           res.redirect("/todo");
       }
   });
});

// Destroy Route
app.delete("/todo/:id", isLoggedIn, function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err, todo){
        if (err){
            console.log(err);
        } else {
            res.redirect("/todo");
        }
    });
});


// Register Route
app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err){
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/todo");
            });
        }
    });
});

// Login Route
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/todo",
      failureRedirect: "/"
    })(req, res);
});


// Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else res.redirect("/");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The todo list server is now starting......");
});
