const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
// const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

// Index Route -> listing all 
router.get("/", async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});

// NEW Route ->add new list
router.get("/new",isLoggedIn , (req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "This listing does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", {listing});
});

// Create Route -> after creating a list using new route this route add the list on index page
router.post("/" , isLoggedIn ,async (req,res)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("sucess", "New Listing Created successfully");
    res.redirect("/listing");
});

// Edit Route
router.get("/:id/edit", isLoggedIn , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", {listing});
});

// Update Route -> update the edit details
 router.put("/:id", isLoggedIn , async (req,res)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("sucess", "Listing Updated successfully");
    res.redirect("/listing");
 });

 // Delete Route
 router.delete("/:id", isLoggedIn, async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing deleted successfully");
    console.log(deletedListing); 
    return res.redirect("/listing");   
 });


module.exports = router;