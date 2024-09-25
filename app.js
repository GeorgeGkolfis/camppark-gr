if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// console.log(process.env.NODE_ENV);
// console.log(typeof process.env.NODE_ENV);
// console.log(process.env.NODE_ENV !== "production");

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const port = 3000;
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/camppark-greece");
    console.log("INITIAL DB CONNECTION OPEN.");
}

main().catch((err) => console.error("INITIAL DB CONNECTION ERROR!!! :", err));

const db = mongoose.connection;
function logError(err) {
    console.error("RUNTIME CONNECTION ERROR: ", err);
}
db.on("error", (err) => {
    logError(err);
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    secret: "secretofthesecrets!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // 7 days in milliseconds
    },
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//or "Static method"-> passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user; /** from session because of passport */
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.render("error", { err });
});

app.listen(port, () => {
    const currentTime = new Date().toLocaleString();
    console.log(`SERVING ON PORT ${port}! \nCurrent time: ${currentTime}`);
});
