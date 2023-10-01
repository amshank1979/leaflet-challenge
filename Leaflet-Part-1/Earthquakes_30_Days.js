// Define the URL of the earthquake data
const earthquakeDataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Create the map
const map = L.map('map').setView([34.052235, -118.243683], 2);

// Add a tile layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch earthquake data using D3
d3.json(earthquakeDataURL).then(data => {
    // Define a function to set marker size based on magnitude
    function getMarkerSize(magnitude) {
        return magnitude * 5;
    }

    // Define a function to set marker color based on depth
    function getMarkerColor(depth) {
        if (depth < 10) return '#00FF00'; // Shallow earthquakes (green)
        if (depth < 30) return '#FFFF00'; // Intermediate earthquakes (yellow)
        if (depth < 50) return '#FFA500'; // Deep earthquakes (orange)
        return '#FF0000'; // Very deep earthquakes (red)
    }

    // Loop through earthquake data and create markers
    data.features.forEach(feature => {
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2];
        const coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Create a circle marker
        const marker = L.circleMarker(coordinates, {
            radius: getMarkerSize(magnitude),
            fillColor: getMarkerColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Add a popup with earthquake information
        marker.bindPopup(`
            Magnitude: ${magnitude}<br>
            Depth: ${depth} km<br>
            Location: ${feature.properties.place}
        `);

        // Add the marker to the map
        marker.addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const depthCategories = [-10, 10, 60, 90];
        const heatmapColors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'];

        // Add legend title
        div.innerHTML = '<h4>Earthquake Depth</h4>';

        for (let i = 0; i < depthCategories.length; i++) {
            div.innerHTML += "<i style='background: " + heatmapColors[i] + "'></i> "
              + depthCategories[i] + (depthCategories[i + 1] ? "&ndash;" + depthCategories[i + 1] + "<br>" : "+");
          }
          return div;
        };
        // Finally, we our legend to the map.
        legend.addTo(map);
      });
