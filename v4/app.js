var express          = require("express"),
      app                = express(),
      bodyParser    = require("body-parser"),
      mongoose     = require("mongoose"),
      Campground = require("./models/campground"),
      Comment      = require("./models/comment"),
      seedDB        = require("./seeds.js");

// CONFIG
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true}) ;
// use body parser
app.use(bodyParser.urlencoded({extended: true}));
//  use EJS engine
app.set("view engine", "ejs");
// purge DB
seedDB();

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
           res.render("campgrounds/index", {campgroundsEJS: allCampgrounds});
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

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


app.post("/campgrounds/:id/comments", function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
           // console.log(req.body.comment);
       }
    });
    // create new comment
    // connect new comment to campground
    // redirect campground show page

});

app.listen(3000, function(){
    console.log("Yelp Camp Started!");
});

// example img address
// https://cdn.pixabay.com/photo/2015/12/08/00/45/starry-night-1081993__340.jpg
// https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg
// https://cdn.pixabay.com/photo/2015/06/08/15/12/tents-801926__340.jpg
