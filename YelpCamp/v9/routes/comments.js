var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");

// Comments NEW
router.get("/new", isLoggedIn, function(req, res){
    //FIND CAMPGROUND BY ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments CREATE
router.post("/", isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
       if(err) {
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           //create new comment
           Comment.create(req.body.comment, function(err, comment){
               if(err) {
                   console.log(err);
               } else {
                  //add user and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save new comment 
                  comment.save();
                  //connect new comment to campground
                  campground.comments.push(comment);
                  campground.save();
                  //redirect campground show page
                  res.redirect('/campgrounds/' + campground._id);
               }
           });
       }
    });
});

//   middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;