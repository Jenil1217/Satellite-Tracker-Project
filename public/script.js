// Constants
const API_ENDPOINTS = {
    POSITIONS: (id, lat, lng, alt, seconds) => `/positions/${id}/${lat}/${lng}/${alt}/${seconds}`,
    // SATELLITE: (id) => `/satellite/${id}`,
    VISIBLE: (lat, lng) => `/visible-satellites?lat=${lat}&lon=${lng}`
};

// Utility functions
const getGeolocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6)
                }),
                error => reject(new Error("Failed to get location. Please enable location services."))
            );
        } else {
            reject(new Error("Geolocation is not supported by your browser."));
        }
    });
};

const updateLocationInputs = (lat, lng) => {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
};

const displayError = (element, message) => {
    element.innerHTML = `<div class="error">${message}</div>`;
    console.error(message);
};

// Main application
document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements
    const elements = {
        satelliteDropdown: document.getElementById("satellite-dropdown"),
        trackButton: document.getElementById("track-button"),
        satelliteDisplay: document.getElementById("satellite-info"),
        locationForm: document.getElementById("location-form"),
        visibleSatsDisplay: document.getElementById("visible-sats"),
        locButton: document.getElementById("loc"),
        latInput: document.getElementById("latitude"),
        lonInput: document.getElementById("longitude")
    };

    // Initialize satellite dropdown
    const demoSatellites = [
        { id: 25544, name: "ISS" },
        { id: 48274, name: "Starlink 1000" }
    ];

    const initializeSatelliteDropdown = () => {
        const fragment = document.createDocumentFragment();
        demoSatellites.forEach(sat => {
            const option = document.createElement("option");
            option.value = sat.id;
            option.textContent = sat.name;
            fragment.appendChild(option);
        });
        elements.satelliteDropdown?.appendChild(fragment);
    };

 // Track satellite with position data
const trackSatellite = async (satId, userLocation) => {
    try {
        // Fetch basic satellite info
        // const satResponse = await fetch(API_ENDPOINTS.SATELLITE(satId));
        // const satData = await satResponse.json();
 
        // Fetch position data (10 seconds of predictions)
        const posResponse = await fetch(
            API_ENDPOINTS.POSITIONS(
                satId,
                userLocation.latitude,
                userLocation.longitude,
                0, // observer altitude (assumed at ground level)
                10  // 10 seconds of predictions
            )
        );
        const posData = await posResponse.json();
        // Calculate speed using two consecutive positions
        const pos1 = posData.positions[0];
        const pos2 = posData.positions[1];
        
        // Time difference is 1 second based on API docs
        const timeDiff = 1; // seconds

        const R = 6371; // Earth's radius in kilometers
        const lat1 = pos1.satlatitude * Math.PI / 180;
        const lat2 = pos2.satlatitude * Math.PI / 180;
        const lon1 = pos1.satlongitude * Math.PI / 180;
        const lon2 = pos2.satlongitude * Math.PI / 180;
        
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        
        const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dlon/2) * Math.sin(dlon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Calculate speed in km/s
        const speed = distance / timeDiff;

        // Display combined data
        elements.satelliteDisplay.innerHTML = `
            <h2>Tracking Satellite: ${posData.info.satname}</h2>
            <p><strong>NORAD ID:</strong> ${posData.info.satid}</p>
            <h3>Current Position:</h3>
            <p><strong>Latitude:</strong> ${posData.positions[0].satlatitude}°</p>
            <p><strong>Longitude:</strong> ${posData.positions[0].satlongitude}°</p>
            <p><strong>Altitude:</strong> ${posData.positions[0].sataltitude} km</p>
            <p><strong>Speed:</strong> ${speed.toFixed(2)} km/s <p>
            <p><strong>Azimuth:</strong> ${posData.positions[0].azimuth}°</p>
            <p><strong>Elevation:</strong> ${posData.positions[0].elevation}°</p>
            
        `;
    } catch (error) {
        displayError(elements.satelliteDisplay, "Error fetching satellite data.");
    }
 };

    // Handle visible satellites search
    const handleVisibleSatellites = async (event) => {
        event?.preventDefault();

        const lat = elements.latInput.value.trim();
        const lon = elements.lonInput.value.trim();

        if (isNaN(lat) || isNaN(lon) || !lat || !lon) {
            displayError(elements.visibleSatsDisplay, "Please enter valid latitude and longitude.");
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.VISIBLE(lat, lon));
            const visibleSatellites = await response.json();

            elements.visibleSatsDisplay.innerHTML = ""; // Clear previous results

            if (!visibleSatellites.above?.length) {
                elements.visibleSatsDisplay.innerHTML = "<h2>No visible satellites found.</h2>";
                return;
            }

            const fragment = document.createDocumentFragment();
            const title = document.createElement("h2");
            title.textContent = "Visible Satellites:";
            fragment.appendChild(title);

            visibleSatellites.above.forEach((sat, index) => {
                const satElement = document.createElement("p");
                satElement.textContent = `${index + 1}. ${sat.satname} (NORAD ID: ${sat.satid})`;
                fragment.appendChild(satElement);
            });

            elements.visibleSatsDisplay.appendChild(fragment);
        } catch (error) {
            displayError(elements.visibleSatsDisplay, "Error fetching visible satellites.");
        }
    };

    // Event Listeners
    const initializeEventListeners = () => {
        elements.trackButton?.addEventListener("click", async () => {
            try {
                const userLocation = await getGeolocation();
                await trackSatellite(elements.satelliteDropdown.value, userLocation);
            } catch (error) {
                displayError(elements.satelliteDisplay, error.message);
            }
        });

        elements.locationForm?.addEventListener("submit", handleVisibleSatellites);

        elements.locButton?.addEventListener("click", async () => {
            try {
                const userLocation = await getGeolocation();
                updateLocationInputs(userLocation.latitude, userLocation.longitude);
            } catch (error) {
                alert(error.message);
            }
        });
    };

    // Initialize application
    const initialize = () => {
        initializeSatelliteDropdown();
        initializeEventListeners();
        console.log("Satellite tracking application initialized successfully!");
    };

    initialize();
});