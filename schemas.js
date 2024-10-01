const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Define a custom extension for Joi to add a new rule: escapeHTML
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // No HTML tags allowed
                    allowedAttributes: {}, // No attributes allowed
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const ExtendedJoi = Joi.extend(extension);

module.exports.campgroundSchema = ExtendedJoi.object({
    campground: ExtendedJoi.object({
        title: ExtendedJoi.string().required().escapeHTML(),
        price: ExtendedJoi.number().required().min(0),
        location: ExtendedJoi.string().required().escapeHTML(),
        description: ExtendedJoi.string().required().escapeHTML(),
    }).required(),
    deleteImages: ExtendedJoi.array(),
});

module.exports.reviewSchema = ExtendedJoi.object({
    review: ExtendedJoi.object({
        rating: ExtendedJoi.number().required().min(0).max(5),
        body: ExtendedJoi.string().required().escapeHTML(),
    }).required(),
});
