const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
// const expressError = require("../utils/expressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

// Reviews 
//POST Route ->

router.post("/" ,async(req,res) =>{
   let result = reviewSchema.validate(req.body);
   console.log(result);
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new Review saved");
   res.redirect(`/listing/${listing._id}`);
});

//Delete Route ->

router.delete("/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
});

module.exports = router;