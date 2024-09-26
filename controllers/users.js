const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to CampPark Greece!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!!!`);
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    logoutUser = req.user.username;
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", `Goodbye ${logoutUser}!!!`);
        res.redirect("/campgrounds");
    });
};
