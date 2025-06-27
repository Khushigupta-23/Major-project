const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path") // ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Review = require("./models/review.js");
// const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);

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

// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page Not Found"));
// });

// app.use((err,req,res,next)=>{
//     let {statusCode, message} = err;
//     res.status(statusCode).send(message);
// });

app.listen(8080,()=>{
    console.log("server is listning on 8080");
});