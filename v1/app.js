var express          = require("express"),
      app                = express(),
      bodyParser    = require("body-parser"),
      mongoose     = require("mongoose");

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true}) ;


// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

// model
var Campground = mongoose.model("Campground", campgroundSchema);

// // adding campground
// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073__340.png"
//     }
//     , function(err, campground) {
//         if (err) {
//                 console.log("ERROR adding campground!");
//             }else {
//             console.log("Added!");
//             console.log(campground);
//         }
//     }
// )
var campgrounds = [
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073__340.png"},
    {name: "Stone Henge", image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"},
    {name: "Coral Lake", image: "https://cdn.pixabay.com/photo/2015/12/08/00/45/starry-night-1081993__340.jpg"},
    {name: "Deep Cove", image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg"},
    {name: "River Way", image: "https://cdn.pixabay.com/photo/2015/06/08/15/12/tents-801926__340.jpg"},
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"},
    {name: "Stone Henge", image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg"},
        {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073__340.png"}
];

// use body parser
app.use(bodyParser.urlencoded({extended: true}));
//  use EJS engine
app.set("view engine", "ejs");

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
           res.render("campgrounds", {campgroundsEJS: allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgroundsEJS: campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds rray
    //  redirect back to campgrounds page
    var name = req.body.newCampground;
    var image = req.body.image;
 
    var newCampground = {name: name, image: image};
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

app.listen(3000, function(){
    console.log("Yelp Camp Started!");
});

// example img address
// https://cdn.pixabay.com/photo/2015/12/08/00/45/starry-night-1081993__340.jpg
// https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg
// https://cdn.pixabay.com/photo/2015/06/08/15/12/tents-801926__340.jpg
