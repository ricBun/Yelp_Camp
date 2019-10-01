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

// ==================
// CONFIG
// ==================
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true}) ;
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
//  use EJS engine
app.set("view engine", "ejs");
// purge DB
seedDB();
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


// ==================
//  ROUTES
// ==================
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log("cant find campgrounds!");
       }
       else {
           res.render("campgrounds/index", {campgroundsEJS: allCampgrounds, currentUser: req.user});
       }
    });
    // res.render("campgrounds", {campgroundsEJS: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
})

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds rray
    //  redirect back to campgrounds page
    var name = req.body.newCampground;
    var image = req.body.image;
    var description = req.body.description;
 
    var newCampground = {name: name, image: image, description: description};
    console.log("This works!");
    // create a new campground and save to DB
    Campground.create(
        newCampground, function(err, campground) {
            if (err) {
                console.log("ERROR adding campground!");
            } else {
                console.log("Added!");
                console.log(campground);
                 res.redirect("/campgrounds");
            }
        }
    );
});

// SHOW - shows more info about campground
app.get("/campgrounds/:id", function(req, res){
    // find campground with provided ID
    // render show template with that campground

    // Campground.findById(req.params.id, function(err, foundCampground){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // render show template with that campground
            console.log("FOUND GROUND");
            console.log(foundCampground);
            res.render("campgrounds/show", {campgroundz: foundCampground});
        }
    });
});


// =========================
//  COMMENTS ROUTES
// =========================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           redirect("/campgrounds");
       } else {
           // create new comment
           // connect new comment to campground
           // redirect campground show page
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
       }
    });
});

// =========================
//  AUTHORIZATION ROUTES
// =========================
app.get("/register", function(req, res){
        res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }) , function(req, res){
});

// logout route
app.get("/logout", function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});

app.listen(3000, function(){
    console.log("Yelp Camp Started!");
});


//  ===============
// HELPER FUNCTIONS
//  ===============
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
