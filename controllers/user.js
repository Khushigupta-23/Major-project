const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");
const User = require("../models/user.js");



module.exports.getSignup = (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.postSignup = async (req, res) => {
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
}


module.exports.getLogin = (req, res) => {
    res.render("users/login.ejs")
}


module.exports.postLogin = async (req, res) => {
    req.flash("sucess", "Welcome to Wanderlust ! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("sucess", "you are logged Out!");
        res.redirect("/listing");
    });
}