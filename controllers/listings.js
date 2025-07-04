const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");

module.exports.Index = async (req, res) => {
    let { category, search } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        query.title = new RegExp(search, 'i');
    }

    const allListings = await Listing.find(query);
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm =  (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.Show = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
        populate : {
            path : "author"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "This listing does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.Create = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
    await newListing.save();
    req.flash("sucess", "New Listing Created successfully");
    res.redirect("/listing");
}

module.exports.Edit = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "This listing does not exist!");
        return res.redirect("/listing");
    }
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", {listing , originalUrl});
}

module.exports.Update = async (req,res)=>{
   let {id} = req.params;
   let result = listingSchema.validate(req.body);
   console.log(result);
    
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url , filename };
    await listing.save();
    }
    req.flash("sucess", "Listing Updated successfully");
    res.redirect("/listing");
 }

 module.exports.Delete =  async(req,res)=>{
     let { id } = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     req.flash("sucess", "Listing deleted successfully");
     console.log(deletedListing); 
     return res.redirect("/listing");   
  }