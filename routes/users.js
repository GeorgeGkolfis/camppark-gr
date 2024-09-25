const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");

// app.use("/", userRoutes);
router
    .route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router
    .route("/login")
    .get(users.renderLogin)
    .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);

router.get("/logout", users.logout);

// router.get("/register", users.renderRegister);
// router.post("/register", catchAsync(users.register));
// router.get("/login", users.renderLogin);
// router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login);
// router.get("/logout", users.logout);

module.exports = router;
