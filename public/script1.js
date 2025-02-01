// Update satellite IDs to match N2YO NORAD IDs
const satellites = [
    { id: 20580, name: "Hubble Space Telescope", velocity: "24000", alt: "123", imgSrc: "assets/hubble.jpg" },
    { id: 25544, name: "ISS", velocity: "27000", alt: "110", imgSrc: "assets/iss.jpg" },
];

// Test function to verify API connection
async function testSatelliteAPI() {
    try {
        const testData = await satelliteApi.getSatellitePositions(
            25544,  // Testing with ISS
            40.7128,
            -74.0060
        );
        console.log('API Test Results:', testData);
    } catch (error) {
        console.error('API Test Failed:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const satelliteDropdown = document.getElementById("satellite-dropdown");
    const trackButton = document.getElementById("track-button");
    const satelliteDisplay = document.getElementById("satellite-info");

    // Test API connection when page loads
    testSatelliteAPI();

    // Populate Satellite Dropdown
    if (satelliteDropdown) {
        satellites.forEach((sat) => {
            const option = document.createElement("option");
            option.value = sat.id;
            option.textContent = sat.name;
            satelliteDropdown.appendChild(option);
        });
    }

    // Handle Tracking
    if (trackButton && satelliteDisplay) {
        trackButton.addEventListener("click", async () => {
            const selectedSatelliteId = satelliteDropdown.value;
            const selectedSatellite = satellites.find(sat => sat.id == selectedSatelliteId);
            
            if (selectedSatellite) {
                try {
                    console.log('Fetching data for satellite:', selectedSatelliteId);
                    
                    // Get user's location (for now using New York coordinates)
                    const latitude = 40.7128;
                    const longitude = -74.0060;
                    
                    // Show loading state
                    satelliteDisplay.innerHTML = `
                        <p>Loading satellite data...</p>
                        <img src="${selectedSatellite.imgSrc}" width="600" height="400">
                    `;

                    const positionData = await satelliteApi.getSatellitePositions(
                        selectedSatelliteId,
                        latitude,
                        longitude,
                        0,
                        1
                    );
                    
                    console.log('Received position data:', positionData);

                    if (positionData.positions && positionData.positions.length > 0) {
                        const position = positionData.positions[0];
                        satelliteDisplay.innerHTML = `
                            <h3>Real-time Tracking Data:</h3>
                            <p>Satellite: ${selectedSatellite.name}</p>
                            <p>Current Position:</p>
                            <ul>
                                <li>Latitude: ${position.satlatitude}°</li>
                                <li>Longitude: ${position.satlongitude}°</li>
                                <li>Altitude: ${position.sataltitude} km</li>
                                <li>Timestamp: ${new Date(position.timestamp * 1000).toLocaleString()}</li>
                            </ul>
                            <img src="${selectedSatellite.imgSrc}" width="600" height="400">
                        `;
                    }
                } catch (error) {
                    console.error('Error fetching satellite data:', error);
                    satelliteDisplay.innerHTML = `
                        <p>Error: Could not fetch real-time data. Showing static information:</p>
                        <p>Satellite: ${selectedSatellite.name}</p>
                        <p>Default Altitude: ${selectedSatellite.alt} km</p>
                        <p>Default Velocity: ${selectedSatellite.velocity} km/h</p>
                        <img src="${selectedSatellite.imgSrc}" width="600" height="400">
                    `;
                }
            }
        });
    }

    // Handle Location Form for Visible Satellites
    const locationForm = document.getElementById("location-form");
    if (locationForm) {
        locationForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const latitude = document.getElementById("latitude").value;
            const longitude = document.getElementById("longitude").value;
            const displayObjects = document.getElementById("visible-sats");

            try {
                displayObjects.innerHTML = "<p>Searching for visible satellites...</p>";
                
                const visibleSats = await satelliteApi.getVisibleSatellites(
                    latitude,
                    longitude,
                    0,
                    90
                );

                if (visibleSats && visibleSats.above) {
                    let content = "<h3>Visible Satellites:</h3>";
                    visibleSats.above.forEach((sat, index) => {
                        content += `
                            <div class="satellite-item">
                                <p><strong>${index + 1}. ${sat.satname}</strong></p>
                                <ul>
                                    <li>Latitude: ${sat.satlat}°</li>
                                    <li>Longitude: ${sat.satlng}°</li>
                                    <li>Altitude: ${sat.satalt} km</li>
                                    <li>NORAD ID: ${sat.satid}</li>
                                </ul>
                            </div>
                        `;
                    });
                    displayObjects.innerHTML = content;
                } else {
                    displayObjects.innerHTML = "<p>No satellites currently visible at this location.</p>";
                }
            } catch (error) {
                console.error('Error fetching visible satellites:', error);
                displayObjects.innerHTML = "<p>Error fetching visible satellites. Please try again later.</p>";
            }
        });
    }
});