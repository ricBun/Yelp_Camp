var express          = require("express"),
      app                = express(),
      bodyParser    = require("body-parser"),
      mongoose     = require("mongoose"),
      passport        = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground = require("./models/campground"),
      Comment      = require("./models/comment"),
      User              = require("./models/user"),
      seedDB        = require("./seeds.js");

// requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      authRoutes = require("./routes/index")

// ==================
// CONFIG
// ==================
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true}) ;
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
//  use EJS engine
app.set("view engine", "ejs");
// // purge DB
// seedDB();
// use stylesheet
app.use(express.static(__dirname + "/public"));
console.log(__dirname);

// ==================
// PASSPORT CONFIGURATION
// ==================
app.use(require("express-session")({
    secret: "Once Again once again",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to plugin user info to every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// all the routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

app.listen(3000, function(){
    console.log("Yelp Camp Started!");
});
