if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path") // ejs
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


main()
.then(console.log("connection sucessfully"))
.catch((err)=>{console.log(err)});

// hello
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));//for req.params
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/",(req,res)=>{
//     res.send("hii, i am root");
// });

app.use(session({
    secret: "luckysonimysecret",
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //( day , hours , min in hr. , sec in min. , milisec in sec. )
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //(security purpose)
    }
}));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.sucessMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",userRouter);

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