const express = require("express");
const router = express.Router({ mergeParams: true });
// With mergeParams: true, this will include { id: '.......' } in app.use("/campgrounds/:id/reviews", reviews);
const { isLoggedIn, isReviewAuthor, validateStarRating, validateReview } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");


// app.use("/campgrounds/:id/reviews", reviewRoutes);
router.post("/", isLoggedIn, validateStarRating, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
