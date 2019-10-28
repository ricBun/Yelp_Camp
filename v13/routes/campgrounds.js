var express = require("express");
var router   = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// INDEX  -- route
router.get("/", function(req,res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log("cant find campgrounds!");
       }
       else {
           res.render("campgrounds/index", {campgroundsEJS: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
       }
    });
    // res.render("campgrounds", {campgroundsEJS: campgrounds});
});

// NEW --  form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

// CREATE route
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds rray
    //  redirect back to campgrounds page
    var name = req.body.newCampground;
    var image = req.body.image;
    var description = req.body.description;
    var cost = req.body.cost;

    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, cost: cost, description: description, author:author};
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
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "campground not found!");
            res.redirect("back");
        } else {
            // render show template with that campground
            res.render("campgrounds/show", {campgroundz: foundCampground});
        }
    });
});

// EDIT - campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// UPDATE - campground route
router.put("/:id", function(req, res){
    // find and update the correct campground
    var newData = {name: req.body.name, image: req.body.image, cost: req.body.cost, description: req.body.description};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    //  redirect somewhere
});

// DESTROY - campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    });
});

module.exports = router;
