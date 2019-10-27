var express          = require("express"),
      app                = express(),
      bodyParser    = require("body-parser"),
      mongoose     = require("mongoose"),
      passport        = require("passport"),
      flash             = require("connect-flash"),
      methodOverride = require("method-override"),
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

// used own environment variable OUTSIDE code
// use export DATABASEURL=""
// unomment this code to revert back to v12!
// mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true}) ;

//trying to use a containerized mongodb DB
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // user: "username",
    // pass: "password"
}).then(() => {
    console.log('successfully connected to the database');
}).catch(err => {
    console.log('error connecting to the database');
    process.exit();
});
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
//  use EJS engine
app.set("view engine", "ejs");

// // purge DB
// seedDB();

// use stylesheet
app.use(express.static(__dirname + "/public"));
console.log(__dirname);

// used to make a PUT request instead of POST
app.use(methodOverride("_method"));

// flash
// NOTE: flash MUST be used  BEFORE PASSPORT CONFIG
app.use(flash());

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

// middleware to plugin user info to EVERY route
// Global variables**
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// all the routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(authRoutes);

app.listen(3000, function(){
    console.log("Yelp Camp Started!");
});
