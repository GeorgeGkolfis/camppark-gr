maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: "cluster-map",
    style: maptilersdk.MapStyle.BRIGHT,
    center: [23.734832368791103, 37.97556502052681],
    zoom: 5,
});

map.on("load", function () {
    map.addSource("campgrounds", {
        type: "geojson",
        data: campgrounds,
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50, 
    });

    map.addLayer({
        id: "clusters",
        type: "circle",
        source: "campgrounds",
        filter: ["has", "point_count"],
        paint: {
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

    map.on("click", "unclustered-point", function (e) {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maptilersdk.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
    });

    map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
    });
});
