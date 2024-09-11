const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 3000;
const Campground = require("./models/campground");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/camppark-greece");
    console.log("INITIAL DB CONNECTION OPEN.");
}

main().catch((err) => console.error("INITIAL DB CONNECTION ERROR!!! :", err));

const db = mongoose.connection;
function logError(err) {
    console.error("RUNTIME CONNECTION ERROR: ", err);
    // Here you can also add additional error handling such as retry logic
}
db.on("error", (err) => {
    logError(err);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

// app.get("/products", async (req, res) => {
//     const { category } = req.query;
//     if (category) {
//         const products = await Product.find({ category });
//         res.render("products/index", { products, category });
//     } else {
//         const products = await Product.find({});
//         res.render("products/index", { products, category: "All" });
//     }
// });

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.listen(port, () => {
    const currentTime = new Date().toLocaleString();
    console.log(`SERVING ON PORT ${port}! \nCurrent time: ${currentTime}`);
});
