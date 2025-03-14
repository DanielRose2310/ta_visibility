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

// Add a title overlay to the map
const title = L.control({ position: 'topright' });

title.onAdd = function () {
    let div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = "<h2>Tel-Aviv Viewshed Visibility Map</h2>";
    return div;
};

title.addTo(map);

// Add an informational snippet explaining visibility and raycasting
const infoBox = L.control({ position: 'bottomleft' });

infoBox.onAdd = function () {
    let div = L.DomUtil.create('div', 'info-box');
    div.innerHTML = `
        <h3>What is Visibility?</h3>
        <p>Visibility analysis determines which areas are visible from a given viewpoint. It's often used in urban planning, surveillance, and geospatial analysis.</p>
        <h4>Computing Visibility with Raycasting:</h4>
        <p>A common approach is raycasting, where a ray is traced from an observer \( O \) to a point \( P \), checking if an obstacle exists along the path.</p>
        <p><strong>Mathematical Definition:</strong></p>
        <p>
        \\[
        V(P) =
        \\begin{cases}
        1, & \\text{if no obstacles along } \\overrightarrow{OP} \\\\
        0, & \\text{if an obstacle exists along } \\overrightarrow{OP}
        \\end{cases}
        \\]
        </p>
        <p>Where:</p>
        <ul>
            <li>\( O \) is the observer's position</li>
            <li>\( P \) is the target point</li>
            <li>\( \\overrightarrow{OP} \) is the ray from \( O \) to \( P \)</li>
        </ul>
    `;
    return div;
};

infoBox.addTo(map);

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

// Add CSS styling for the title and info box with transparency and glass effect
const style = document.createElement("style");
style.innerHTML = `
    .map-title {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        padding: 12px 16px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 8px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .info-box {
        background: rgba(20, 20, 20, 0.6);
        backdrop-filter: blur(8px);
        padding: 12px 16px;
        font-size: 13px;
        border-radius: 8px;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        max-width: 300px;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .info-box h3, .info-box h4 {
        margin: 5px 0;
        color: #ffdd57;
    }

    .info-box p, .info-box ul {
        margin: 5px 0;
        font-size: 12px;
    }

    .info-box pre {
        background: rgba(255, 255, 255, 0.2);
        padding: 5px;
        border-radius: 5px;
        font-family: monospace;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Add MathJax for LaTeX formula rendering
const mathJaxScript = document.createElement("script");
mathJaxScript.type = "text/javascript";
mathJaxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js";
mathJaxScript.async = true;
document.head.appendChild(mathJaxScript);
