const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Signup
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        //auto login 
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("sucess", "Welcome to Wanderlust!");
            res.redirect("/listing");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

// Login
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login",
    saveRedirectUrl ,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("sucess", "Welcome to Wanderlust ! You are logged in!");
        res.redirect(req.session.redirectUrl);
    }
);


// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("sucess", "you are logged Out!");
        res.redirect("/listing");
    });
});

module.exports = router;