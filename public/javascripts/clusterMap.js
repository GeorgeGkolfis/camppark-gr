maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: "cluster-map",
    style: maptilersdk.MapStyle.BRIGHT,
    center: [23.734832368791103, 37.97556502052681],
    zoom: 5,
    // navigationControl: false, //disable the navigation control
});

map.on("load", function () {
    map.addSource("campgrounds", {
        type: "geojson",
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
            // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
            // with three steps to implement three types of circles:
            "circle-color": ["step", ["get", "point_count"], "#93C5FD", 5, "#3B82F6", 10, "#1D4ED8"],
            "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 10, 25],
        },
    });

    map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "campgrounds",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
        },
    });

    map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "campgrounds",
        filter: ["!", ["has", "point_count"]],
        paint: {
            "circle-color": "#93C5FD",
            "circle-radius": 6,
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#000000",
        },
    });

    // inspect a cluster on click
    map.on("click", "clusters", async (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource("campgrounds").getClusterExpansionZoom(clusterId);
        map.easeTo({
            center: features[0].geometry.coordinates,
            zoom,
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on("click", "unclustered-point", function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        // const campgroundByCoordinates = function (coordinates, tolerance = 0.001) {
        //     const coordinatesAreClose = function (arr1, arr2, tolerance) {
        //         if (arr1.length !== arr2.length) return false;
        //         for (let i = 0; i < arr1.length; i++) {
        //             if (Math.abs(arr1[i] - arr2[i]) > tolerance) {
        //                 return false; // Return false if the difference exceeds the tolerance
        //             }
        //         }
        //         return true;
        //     };
        //     for (let camp of campgrounds.features) {
        //         if (coordinatesAreClose(camp.geometry.coordinates, coordinates, tolerance)) {
        //             return camp;
        //         }
        //     }
        // };

        // const camp = campgroundByCoordinates(coordinates);

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
        //.setHTML(`<h3>${camp.title}</h3><p>${camp.location}</p>`)
    });

    map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
    });
});
