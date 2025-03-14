// Initialize the Leaflet map
var map = L.map('map').setView([32.0853, 34.7818], 13);
const initialBounds = map.getBounds();

// Add a tile layer from OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Function to lock the map within its initial bounds
function lockMapToBounds() {
    map.setMaxBounds(initialBounds);
}
map.once('moveend', lockMapToBounds);
map.on('move', lockMapToBounds);

// Load the GeoJSON data using fetch
fetch('./data.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Validate if the loaded data is a proper GeoJSON
        if (!data || data.type !== "FeatureCollection") {
            throw new Error("Invalid GeoJSON data");
        }

        // Extract and normalize attribute values
        const attributeData = data.features.map(feature => feature.properties.area_mean);
        const minValue = Math.min(...attributeData);
        const maxValue = Math.max(...attributeData);

        function normalizeValue(value) {
            return ((value - minValue) / (maxValue - minValue)) * 255;
        }

        // Function to style GeoJSON points
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

        // Add the GeoJSON data to the map
        L.geoJSON(data, { pointToLayer: getFeatureStyle }).addTo(map);
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
