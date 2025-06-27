const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
// const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");

// Index Route -> listing all 
router.get("/", async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});

// NEW Route ->add new list
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
});

// Create Route -> after creating a list using new route this route add the list on index page
router.post("/" ,async (req,res)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
});

// Edit Route
router.get("/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route -> update the edit details
 router.put("/:id", async (req,res)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
 });

 // Delete Route
 router.delete("/:id", async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);    
 });


module.exports = router;