const inProduction = process.env.NODE_ENV === "production";

if (!inProduction) {
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
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/camppark-greece";
// const dbUrl = "mongodb://127.0.0.1:27017/camppark-greece";

async function main() {
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Optional, ensures the connection is properly timed out
    });
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
app.use(mongoSanitize({ replaceWith: "_" }));

app.use((req, res, next) => {
    req.setTimeout(60000); //server's 60 seconds timeout
    next();
});

const mongoSecret = process.env.MONGO_STORE_SECRET || "thisshouldbeasecret!";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 60 * 60 * 24, //24 hours in seconds
    crypto: {
        secret: mongoSecret,
    },
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionSecret = process.env.SESSION_SECRET || "thisshouldbeasecret!";

const sessionConfig = {
    store,
    name: "session",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: inProduction ? false : true, // Avoid unnecessary sessions in production
    cookie: {
        httpOnly: true,
        secure: inProduction ? true : false, // only accessible via HTTP(S)
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days in milliseconds
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
    },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = ["https://api.maptiler.com/"];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dinr9lnhw/",
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//or "Static method"-> passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.inProduction = inProduction;
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    const currentTime = new Date().toLocaleString();
    console.log(`SERVING ON PORT ${port}! \nCurrent time: ${currentTime}`);
});
