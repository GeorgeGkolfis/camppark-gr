const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@dinr9lnhw
// "or"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    timeout: 60000,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "CampPark-Greece",
        allowedFormats: ["jpeg", "png", "jpg"],
    },
});

module.exports = {
    cloudinary,
    storage,
};
