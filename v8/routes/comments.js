var express = require("express");
// merge params of campgrounds and comments
//  makes it so that you can travel from routes/campgrounds.js to routes/comments.js with id info
var router   = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
// =========================
//  COMMENTS ROUTES
// =========================

router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
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
                  // add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username  = req.user.username;
                  // save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  console.log(comment);
                  res.redirect("/campgrounds/" + campground._id);
              }
           });
       }
    });
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

module.exports = router;
