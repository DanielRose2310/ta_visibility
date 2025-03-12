fetch('./data.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Check if the data is a valid GeoJSON object
        if (!data || !data.type || data.type !== "FeatureCollection") {
            throw new Error("Invalid GeoJSON data");
        }

        const attributeData = data.features.map(feature => feature.properties.area_mean);
        const minValue = Math.min(...attributeData);
        const maxValue = Math.max(...attributeData);

        function normalizeValue(value) {
            return ((value - minValue) / (maxValue - minValue)) * 255;
        }

        function getFeatureStyle(feature, latlng) {
            const value = feature.properties.area_mean;
            const normalizedValue = normalizeValue(value);
            const colorValue = Math.round(255 - normalizedValue);
            const color = `rgba(255, ${colorValue}, ${colorValue}, 1)`;

            return L.circleMarker(latlng, {
                radius: 4,
                fillColor: color,
                color: 'black',
                weight: 0.8,
                fillOpacity: 0.9,
            });
        }

        L.geoJSON(data, { pointToLayer: getFeatureStyle }).addTo(map);
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
