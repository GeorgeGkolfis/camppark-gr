const express = require("express");
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");


// app.use("/campgrounds", campgroundRoutes);
router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// router.get("/", catchAsync(campgrounds.index));
// router.get("/new", isLoggedIn, campgrounds.renderNewForm);
// router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// router.get("/:id", catchAsync(campgrounds.showCampground));
// router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
// router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
// router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
