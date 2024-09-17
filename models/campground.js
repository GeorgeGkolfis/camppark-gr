const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    // I use "findOneAndDelete" middleware because in app.delete("/campgrounds/:id",.....),
    // i use (model).findByIdAndDelete() that triggers this specific Query middleware.
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
