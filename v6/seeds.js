var mongoose = require("mongoose"),
Campground  = require("./models/campground");
Comment       = require("./models/comment");

var data = [
    {
        name: "Night Sky",
        image:"https://cdn.pixabay.com/photo/2015/12/08/00/45/starry-night-1081993__340.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget consequat diam. Cras at dui a mi auctor venenatis. Vivamus sagittis porttitor orci, in euismod odio convallis et. Aliquam quis imperdiet tellus. Donec ac mauris libero. Maecenas bibendum arcu eu fringilla rutrum. Mauris et turpis id nunc scelerisque interdum non at ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
        name: "Beauty Beaut",
        image:"https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget consequat diam. Cras at dui a mi auctor venenatis. Vivamus sagittis porttitor orci, in euismod odio convallis et. Aliquam quis imperdiet tellus. Donec ac mauris libero. Maecenas bibendum arcu eu fringilla rutrum. Mauris et turpis id nunc scelerisque interdum non at ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
        name: "Glowy Tent",
        image:"https://image.shutterstock.com/image-photo/tent-glows-under-night-sky-260nw-281939390.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget consequat diam. Cras at dui a mi auctor venenatis. Vivamus sagittis porttitor orci, in euismod odio convallis et. Aliquam quis imperdiet tellus. Donec ac mauris libero. Maecenas bibendum arcu eu fringilla rutrum. Mauris et turpis id nunc scelerisque interdum non at ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
        name: "Awesome Grounds",
        image:"https://cdn.pixabay.com/photo/2015/06/08/15/12/tents-801926__340.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget consequat diam. Cras at dui a mi auctor venenatis. Vivamus sagittis porttitor orci, in euismod odio convallis et. Aliquam quis imperdiet tellus. Donec ac mauris libero. Maecenas bibendum arcu eu fringilla rutrum. Mauris et turpis id nunc scelerisque interdum non at ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
        name: "Litty Lit",
        image:"https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg",
        description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget consequat diam. Cras at dui a mi auctor venenatis. Vivamus sagittis porttitor orci, in euismod odio convallis et. Aliquam quis imperdiet tellus. Donec ac mauris libero. Maecenas bibendum arcu eu fringilla rutrum. Mauris et turpis id nunc scelerisque interdum non at ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    }
]

function seedDB(){
    // remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
        }

        // add a few campgrounds
        // NOTE - adding campgrounds in the callback function AFTER deleting
        // to guarantee that we've deleted the campground first
        data.forEach(function(seed){
           Campground.create(seed, function(err, campground){
               if(err){
                   console.log(err);
               } else {
                   // create a comment
                   Comment.create(
                       {
                           text: "This place was great! but I wish there was internet",
                           author: "Homer"
                       }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment!");
                            }
                       }
                   );
               }
           })
        });
        console.log("added campgrounds!");
    });
}

module.exports = seedDB;
