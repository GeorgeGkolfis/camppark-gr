const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
    url: String,
    filename: String,
});


ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
    // src="https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287386/picked_olives_0_aak0dl.jpg"
    //replace-regexp
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);


CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.location}</p>`;
    // this. refers to the particular campground instance
    // <p>${this.description.substring(0, 20)}...</p>
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    // I use "findOneAndDelete" middleware because in app.delete("/campgrounds/:id",.....),
    // i use (model).findByIdAndDelete() which triggers this specific Query middleware.
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
