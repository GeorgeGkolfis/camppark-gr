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
    /*...app.listen() starts the server as soon as it's invoked...*/
    const currentTime = new Date().toLocaleString();
    console.log(`SERVING ON PORT ${port}! \nCurrent time: ${currentTime}`);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[randomCity].city}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
            price,
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
            // process.exit(0); /*CODE(0):OK...Necessary to exit Node.js, if for some reason doesn't exits!!! */
        })
        .catch((err) => {
            console.error("Error closing database connection!!! : ", err);
            // process.exit(1); /*CODE(1):ERROR...Necessary to exit Node.js, if for some reason doesn't exits !!! */
        });
});
