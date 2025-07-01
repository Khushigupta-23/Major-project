const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup
router 
.route("/signup")
.get(userController.getSignup)
.post(userController.postSignup);

// Login
router 
.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl ,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.postLogin
);

// Logout
router.get("/logout", userController.logout);

module.exports = router;