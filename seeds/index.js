const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/camppark-greece");
    console.log("INITIAL DB CONNECTION OPENED.");
}

main().catch((err) => console.error("INITIAL DB CONNECTION ERROR!!! :", err));

const db = mongoose.connection;
function logError(err) {
    console.error("RUNTIME CONNECTION ERROR: ", err);
}
db.on("error", (err) => {
    logError(err);
});

const server = app.listen(port, () => {
    const currentTime = new Date().toLocaleString();
    console.log(`SERVING ON PORT ${port}! \nCurrent time: ${currentTime}`);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

function extractCoordinatesFromUrl(url) {
    const matches = url.match(/q=(-?\d+.\d+),(-?\d+.\d+)/); 
    if (matches) {
        return [parseFloat(matches[2]), parseFloat(matches[1])]; 
    }
    return [0, 0];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            //YOUR USER ID(author)
            author: "66fbff89c807434482875059",
            location: `${cities[randomCity].city}, GR`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
            price,
            geometry: {
                type: "Point",
                coordinates: extractCoordinatesFromUrl(cities[randomCity].Location),
            },
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            images: [
                {
                    url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287395/4_vertical_grey_rocks_hem_in_the_lush_and_narrow_valley_the_pineios_uses_to_escape_to_the_sea-1_d6izll.jpg",
                    filename:
                        "CampPark-Greece/4_vertical_grey_rocks_hem_in_the_lush_and_narrow_valley_the_pineios_uses_to_escape_to_the_sea-1_d6izll",
                },
                {
                    url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287392/4_the_old_stone_bridge_constructed_in_1787_close_to_tsangarada_village_pelion_mountain-1_oaqcu6.jpg",
                    filename: "CampPark-Greece/4_the_old_stone_bridge_constructed_in_1787_close_to_tsangarada_village_pelion_mountain-1_oaqcu6",
                },
                
            ],
        });
        await camp.save();
    }
};

seedDB().then(async () => {
    await console.log("Seeding complete, closing connection...");
    await db
        .close()
        .then(async () => {
            await console.log("DB CONNECTION CLOSED.");
            server.close();
        })
        .catch((err) => {
            console.error("Error closing database connection!!! : ", err);
        });
});
