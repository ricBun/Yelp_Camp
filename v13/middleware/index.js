// all middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            // does user own campground?
            if(err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect('/campgrounds');
            } else {
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that!');
                    res.redirect('/campgrounds/' + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('/campgrounds/' + req.params.id);
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            // does user own comment?
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back")
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash('error', 'You don\'t have permission to do that!');
                    res.redirect('/campgrounds/' + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect('/campgrounds/' + req.params.id);
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj
