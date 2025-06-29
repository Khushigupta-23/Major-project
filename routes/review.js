const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
// const expressError = require("../utils/expressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Reviews 
//POST Route ->

router.post("/" , isLoggedIn , reviewController.createReview);

//Delete Route ->

router.delete("/:reviewId", isLoggedIn , isReviewAuthor , reviewController.deleteReview);

module.exports = router;