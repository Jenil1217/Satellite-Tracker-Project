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

// Calculate satellite speed (common function to avoid duplication)
const calculateSatelliteSpeed = (pos1, pos2, timeDiff = 1) => {
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
    return distance / timeDiff;
};

// Define showSatellitePopup in the global scope so it can be called from HTML
window.showSatellitePopup = async (satId) => {
    const modal = document.getElementById("satellite-modal");
    const modalContent = document.getElementById("satellite-info-popup");
    
    if (!modal || !modalContent) {
        console.error("Modal elements not found in the DOM");
        return;
    }
    
    try {
        // Get the current values from input fields
        const latInput = document.getElementById("latitude");
        const lonInput = document.getElementById("longitude");
        
        const userLocation = {
            latitude: latInput.value.trim(),
            longitude: lonInput.value.trim()
        };

        // Call the API
        const posResponse = await fetch(
            API_ENDPOINTS.POSITIONS(
                satId,
                userLocation.latitude,
                userLocation.longitude,
                0, // altitude (ground level)
                10 // seconds prediction
            )
        );
        const posData = await posResponse.json();

        // Calculate speed using the common function
        const speed = calculateSatelliteSpeed(posData.positions[0], posData.positions[1]);

        // Populate modal with satellite info
        modalContent.innerHTML = `
            <h2>Tracking Satellite: ${posData.info.satname}</h2>
            <p><strong>NORAD ID:</strong> ${posData.info.satid}</p>
            <h3>Current Position:</h3>
            <p><strong>Latitude:</strong> ${posData.positions[0].satlatitude}°</p>
            <p><strong>Longitude:</strong> ${posData.positions[0].satlongitude}°</p>
            <p><strong>Altitude:</strong> ${posData.positions[0].sataltitude} km</p>
            <p><strong>Speed:</strong> ${speed.toFixed(6)} km/s</p>
            <p><strong>Azimuth:</strong> ${posData.positions[0].azimuth}°</p>
            <p><strong>Elevation:</strong> ${posData.positions[0].elevation}°</p>
        `;

        // Show modal
        modal.style.display = "block";
    } catch (error) {
        console.error("Error fetching satellite data:", error);
        const errorMessage = "Error fetching satellite data.";
        modalContent ? modalContent.innerHTML = `<div class="error">${errorMessage}</div>` : alert(errorMessage);
    }
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
            
            // Calculate speed using the common function
            const speed = calculateSatelliteSpeed(posData.positions[0], posData.positions[1]);

            // Display combined data
            elements.satelliteDisplay.innerHTML = `
                <h2>Tracking Satellite: ${posData.info.satname}</h2>
                <p><strong>NORAD ID:</strong> ${posData.info.satid}</p>
                <h3>Current Position:</h3>
                <p><strong>Latitude:</strong> ${posData.positions[0].satlatitude}°</p>
                <p><strong>Longitude:</strong> ${posData.positions[0].satlongitude}°</p>
                <p><strong>Altitude:</strong> ${posData.positions[0].sataltitude} km</p>
                <p><strong>Speed:</strong> ${speed.toFixed(6)} km/s <p>
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
                satElement.innerHTML = `
                    ${index + 1}. 
                    <a href="#" onclick="showSatellitePopup(${sat.satid})">
                        ${sat.satname} (NORAD ID: ${sat.satid})
                    </a>
                `;
                fragment.appendChild(satElement);
            });
            
            elements.visibleSatsDisplay.appendChild(fragment);
        } catch (error) {
            displayError(elements.visibleSatsDisplay, "Error fetching visible satellites.");
        }
    };

    // Set up modal close functionality
    const setupModalClose = () => {
        const modal = document.getElementById("satellite-modal");
        const closeButton = document.querySelector(".close-button");
        
        if (closeButton && modal) {
            closeButton.addEventListener("click", () => {
                modal.style.display = "none";
            });
            
            // Close modal when clicked outside of content
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
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
        setupModalClose();
        console.log("Satellite tracking application initialized successfully!");
    };

    initialize();
});