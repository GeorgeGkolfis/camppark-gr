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

function extractCoordinatesFromUrl(url) {
    const matches = url.match(/q=(-?\d+.\d+),(-?\d+.\d+)/); // Extract coordinates from Google Maps URL
    if (matches) {
        return [parseFloat(matches[2]), parseFloat(matches[1])]; // Longitude first
    }
    return [0, 0]; // Default in case of no match
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            //YOUR USER ID(author)
            author: "66f159528f16aba3af107bfd",
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
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287392/sunset_on_a_traditional_alley_in_megalo_papingo_village_in_ioannina-1_udta5q.jpg",
                //     filename: "CampPark-Greece/sunset_on_a_traditional_alley_in_megalo_papingo_village_in_ioannina-1_udta5q",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287392/shutterstock_1188663136_aerial_view_of_the_old_stone_bridge_in_klidonia_zagoria_in_the_autumn_epirus_western_greece._this_arch_bridge_with_elongated_arch_built_in_1853_qnt3j1.jpg",
                //     filename: "CampPark-Greece/shutterstock_1188663136_aerial_view_of_the_old_stone_bridge_in_klidonia_zagoria_in_the_autumn_epirus_western_greece._this_arch_bridge_with_elongated_arch_built_in_1853_qnt3j1",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287386/picked_olives_0_aak0dl.jpg",
                //     filename: "CampPark-Greece/picked_olives_0_aak0dl",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287386/christian_orthodox_church_in_porto_lagos_vistonida_lake_xanthi-1_hp3klh.jpg",
                //     filename: "CampPark-Greece/christian_orthodox_church_in_porto_lagos_vistonida_lake_xanthi-1_hp3klh",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287386/shutterstock_1188660865_aerial_view_of_the_the_vikos_gorge_in_the_autumn_dtxrlk.jpg",
                //     filename: "CampPark-Greece/shutterstock_1188660865_aerial_view_of_the_the_vikos_gorge_in_the_autumn_dtxrlk",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287385/3_the_prespa_lakes_also_known_as_prespes_is_probably_one_of_greeces_best-kept_secrets-petar_petkovski-1_yltthf.jpg",
                //     filename: "CampPark-Greece/3_the_prespa_lakes_also_known_as_prespes_is_probably_one_of_greeces_best-kept_secrets-petar_petkovski-1_yltthf",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287383/the_magical_landscape_of_mt_boeblx.jpg",
                //     filename: "CampPark-Greece/the_magical_landscape_of_mt_boeblx",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287380/4_the_serpentine_nestos_river-1_r7zqds.jpg",
                //     filename: "CampPark-Greece/4_the_serpentine_nestos_river-1_r7zqds",
                // },
                // {
                //     url: "https://res.cloudinary.com/dinr9lnhw/image/upload/v1727287380/thyme__cheese__bread__tomatoes_and_olives_from_crete_fbaelo.jpg",
                //     filename: "CampPark-Greece/thyme__cheese__bread__tomatoes_and_olives_from_crete_fbaelo",
                // },
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
            // process.exit(0); /*CODE(0):OK...Necessary to exit Node.js, if for some reason doesn't exits!!! */
        })
        .catch((err) => {
            console.error("Error closing database connection!!! : ", err);
            // process.exit(1); /*CODE(1):ERROR...Necessary to exit Node.js, if for some reason doesn't exits !!! */
        });
});
