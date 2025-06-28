const express = require("express");
const app = express();
// const users = require("./routes/user.js");
// const posts = require("./routes/posts.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.use(session({
    secret: "luckysonimysecret",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.sucessMsg = req.flash("sucess");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash("error", "User not registerd successfully");
    } else {
        req.flash("sucess", "User registerd successfully");
    }

    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
});

app.get("/", (req, res) => {
    res.send("session started");
});

app.listen(3000, () => {
    console.log("app is listning to 3000");
});