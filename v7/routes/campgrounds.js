var express = require("express");
var router   = express.Router();
var Campground = require("../models/campground");

// INDEX  -- route
router.get("/", function(req,res){
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

// NEW --  form to create new campground
router.get("/new", function(req, res){
    res.render("campgrounds/new");
})

// create route
router.post("/", function(req, res){
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
router.get("/:id", function(req, res){
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

module.exports = router;
