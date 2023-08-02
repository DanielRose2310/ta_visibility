import data from './data.geojson' assert { type: 'json' };

var map = L.map('map').setView([32.0853, 34.7818], 13);
const initialBounds = map.getBounds();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
function lockMapToBounds() {
    map.setMaxBounds(initialBounds);
  }
  map.once('moveend', lockMapToBounds);
  map.on('move', lockMapToBounds);
  // Function to normalize attribute values to the 0-100 range
  const attributeData = data.features.map(feature => feature.properties.area_mean);
  const minValue = Math.min(...attributeData);
  const maxValue = Math.max(...attributeData);
  

  // Function to normalize attribute values to the 0-100 range
  function normalizeValue(value) {
    return (value - minValue) / (maxValue - minValue) * 255;
  }

  // Function to set style based on the normalized attribute value
  function getFeatureStyle(feature, latlng) {
    const value = feature.properties.area_mean; // Change "value" to your actual attribute name
    const normalizedValue = normalizeValue(value);
    
    // Set the color based on the normalized value
    const color = `rgba(255, ${255 - normalizedValue}, ${255 - normalizedValue}, 1)`;
    console.log(color)
    // Create a CircleMarker with the calculated color
    return L.circleMarker(latlng, {
        radius:5,
      fillColor: color,
      color: 'black',
      weight: 0.4,
      fillOpacity: 0.8,
    });
  }

  // Add GeoJSON layer with custom styles
  L.geoJSON(data, {
    pointToLayer: getFeatureStyle,
  }).addTo(map);
