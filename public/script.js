const satellites = [
    { id: 1, name: "Hubble Space Telescope", velocity: "24000", alt: "123", imgSrc: "assets/hubble.jpg" },
    { id: 2, name: "ISS", velocity: "27000", alt: "110", imgSrc: "assets/iss.jpg" },
];

document.addEventListener("DOMContentLoaded", () => {
    const satelliteDropdown = document.getElementById("satellite-dropdown");
    const trackButton = document.getElementById("track-button");
    const satelliteDisplay = document.getElementById("satellite-info");

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
        trackButton.addEventListener("click", () => {
            const selectedSatelliteId = satelliteDropdown.value;
            
            // Find the satellite by ID
            const selectedSatellite = satellites.find(sat => sat.id == selectedSatelliteId);
            
            if (selectedSatellite) {
                  satelliteDisplay.innerHTML = `Tracking Satellite: ${selectedSatellite.name}<br>
                Orbital Velocity: ${selectedSatellite.velocity} km/h<br>
                Altitude: ${selectedSatellite.alt} km <br><br> 
                <img src = "${selectedSatellite.imgSrc}" width = "600" height = "400">`;
             }
            
        });
    }

   
    const locationForm = document.getElementById("location-form");
    if (locationForm) {
        locationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const latitude = document.getElementById("latitude").value;
            const longitude = document.getElementById("longitude").value;
        
            const displayObjects = document.getElementById("visible-sats")
            let n = 0;

            let content = "<b> Visible objects in sky: </b><br><br>";
            satellites.forEach((sat, index) => {
              content += ` (${index + 1}) ${sat.name}<br>
                Orbital Velocity: ${sat.velocity} km/h<br>
                Altitude: ${sat.alt} km <br><br>`;
            });
            displayObjects.innerHTML = content; 
        })
    }
});