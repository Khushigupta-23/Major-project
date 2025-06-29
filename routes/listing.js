const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
// const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// Index Route -> listing all 
router.get("/", listingController.Index);

// NEW Route ->add new list
router.get("/new",isLoggedIn ,listingController.renderNewForm);

// Show Route
router.get("/:id", listingController.Show);

// Create Route -> after creating a list using new route this route add the list on index page
router.post("/" , isLoggedIn ,listingController.Create);

// Edit Route
router.get("/:id/edit", isLoggedIn , listingController.Edit);

// Update Route -> update the edit details
 router.put("/:id", isLoggedIn , listingController.Update);

 // Delete Route
 router.delete("/:id", isLoggedIn, isOwner, listingController.Delete);


module.exports = router;