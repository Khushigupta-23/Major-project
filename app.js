const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path") // ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");


main()
.then(console.log("connection sucessfully"))
.catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//for req.params
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hii, i am root");
});

// Index Route -> listing all 
app.get("/listing", async (req,res)=>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs", {allListings});
});

// NEW Route ->add new list
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listing/:id", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create Route -> after creating a list using new route this route add the list on index page
app.post("/listing" ,async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
});

// Edit Route
app.get("/listing/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route -> update the edit details
 app.put("/listing/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
 });

 // Delete Route
 app.delete("/listing/:id", async(req,res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);    
 });


// Reviews 
//POST Route ->

app.post("/listing/:id/reviews" ,async(req,res) =>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.review.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new Review saved");
   res.redirect(`/listing/${listing._id}`);
});

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description : "The new villa in mountain",
//         image : " ",
//         price : 1000000,
//         location : "New Delhi",
//         country : "India",
//     });

//     await sampleListing.save().then((res)=>{console.log("Data Save")}).catch((err)=>{console.log(err)});
// });


app.listen(8080,()=>{
    console.log("server is listning on 8080");
});