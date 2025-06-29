const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup
router.get("/signup", userController.getSignup);

router.post("/signup", userController.postSignup);

// Login
router.get("/login", userController.getLogin)

router.post("/login",
    saveRedirectUrl ,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.postLogin
);


// Logout
router.get("/logout", userController.logout);

module.exports = router;