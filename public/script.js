document.addEventListener("DOMContentLoaded", () => {
    const satelliteDropdown = document.getElementById("satellite-dropdown");
    const trackButton = document.getElementById("track-button");
    const satelliteDisplay = document.getElementById("satellite-info");

    // Populate Satellite Dropdown (Demo IDs)
    const demoSatellites = [
        { id: 25544, name: "ISS" },
        { id: 48274, name: "Starlink 1000" }
    ];
    demoSatellites.forEach((sat) => {
        const option = document.createElement("option");
        option.value = sat.id;
        option.textContent = sat.name;
        satelliteDropdown.appendChild(option);
    });

    // Track a Satellite
    trackButton.addEventListener("click", async () => {
        const satId = satelliteDropdown.value;
        try {
            const response = await fetch(`/satellite/${satId}`);
            const data = await response.json();
            satelliteDisplay.innerHTML = `
                <h2>Tracking Satellite: ${data.info.satname}</h2>
                <p><strong>NORAD ID:</strong> ${data.info.satid}</p>
                <p><strong>Data</strong> ${data.tle}</p>
            `;
        } catch (error) {
            satelliteDisplay.innerHTML = "Error fetching satellite data.";
            console.error(error);
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded successfully!");

    const locationForm = document.getElementById("location-form");
    const visibleSatsDisplay = document.getElementById("visible-sats");

    locationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        // console.log("Form submitted!");

        const lat = document.getElementById("latitude").value.trim();
        const lon = document.getElementById("longitude").value.trim();
        console.log(`Frontend Latitude: ${lat}, Longitude: ${lon}`);

        if (isNaN(lat) || isNaN(lon) || lat === "" || lon === "") {
            visibleSatsDisplay.innerHTML = "<h2>Please enter valid latitude and longitude.</h2>";
            return;
        }

        try {
            const response = await fetch(`/visible-satellites?lat=${lat}&lon=${lon}`);
            const visibleSatellites = await response.json();
            // console.log("Visible Satellites:", visibleSatellites);

            visibleSatsDisplay.innerHTML = ""; // Clear previous results

            if (!visibleSatellites.above || visibleSatellites.above.length === 0) {
                visibleSatsDisplay.innerHTML = "<h2>No visible satellites found.</h2>";
            } else {
                const title = document.createElement("h2");
                title.textContent = "Visible Satellites:";
                visibleSatsDisplay.appendChild(title);

                visibleSatellites.above.forEach((sat, index) => {
                    const satElement = document.createElement("p");
                    satElement.textContent = `${index + 1}. ${sat.satname} (NORAD ID: ${sat.satid})`;
                    visibleSatsDisplay.appendChild(satElement);
                });
            }
        } catch (error) {
            visibleSatsDisplay.innerHTML = "Error fetching visible satellites.";
            console.error("Fetch error:", error);
        }
    });
});
