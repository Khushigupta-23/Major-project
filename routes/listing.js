const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
// const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get(listingController.Index)
.post(isLoggedIn ,upload.single("listing[image]") ,listingController.Create);

// NEW Route ->add new list
router.get("/new",isLoggedIn ,listingController.renderNewForm);

router
.route("/:id")
.get(listingController.Show)
.put(isLoggedIn ,isOwner ,upload.single("image") , listingController.Update)
.delete(isLoggedIn, isOwner, listingController.Delete);

// Edit Route
router.get("/:id/edit", isLoggedIn , listingController.Edit);

module.exports = router;