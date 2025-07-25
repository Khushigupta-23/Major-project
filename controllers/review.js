const Review = require ("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) =>{
   let result = reviewSchema.validate(req.body);
   console.log(result);
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new Review saved");
   req.flash("sucess", "Review Created successfully");
   res.redirect(`/listing/${listing._id}`);
}


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash("sucess", "Review Deleted successfully");
    res.redirect(`/listing/${id}`);
}