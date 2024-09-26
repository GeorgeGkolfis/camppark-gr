const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),

        // images: Joi.array()
        //     .items(
        //         Joi.object({
        //             url: Joi.string().uri().required(), // Each image must have a valid URL
        //             filename: Joi.string().required(), // Each image must have a filename
        //         })
        //     )
        //     .required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        body: Joi.string().required(),
    }).required(),
});
