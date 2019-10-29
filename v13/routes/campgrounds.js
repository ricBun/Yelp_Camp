var express = require("express");
var router   = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// google maps API
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);
// end of google maps API

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
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var cost = req.body.cost;


    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }

        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {name: name, image: image, description: description, cost:cost,  author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
  });
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
            res.render("campgrounds/show", {campground: foundCampground, mapAPI: process.env.MAPS_API_KEY});
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
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.lat = data[0].latitude;
    req.body.lng = data[0].longitude;
    req.body.location = data[0].formattedAddress;

      Campground.findByIdAndUpdate(req.params.id, req.body, function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// DESTROY - campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    });
});

module.exports = router;
