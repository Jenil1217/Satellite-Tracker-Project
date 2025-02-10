
//   import { getSatelliteById, getSatellitePosition, getVisibleSatellites } from './.js';

//   document.addEventListener("DOMContentLoaded", () => {
//     const satelliteDropdown = document.getElementById("satellite-dropdown");
//     const trackButton = document.getElementById("track-button");
//     const satelliteDisplay = document.getElementById("satellite-info");

//     // Populate Satellite Dropdown
//     satellites.forEach((sat) => {
//       const option = document.createElement("option");
//       option.value = sat.id;
//       option.textContent = sat.name;
//       satelliteDropdown.appendChild(option);
//     });

//     // Handle Tracking
//     trackButton.addEventListener("click", async () => {
//       const selectedSatelliteId = satelliteDropdown.value;
//       try {
//         const satellite = await getSatelliteById(selectedSatelliteId);
//         satelliteDisplay.innerHTML = `
//           Tracking Satellite: ${satellite.name}<br>
//           Orbital Velocity: ${satellite.velocity} km/h<br>
//           Altitude: ${satellite.alt} km<br>
//           <img src="${satellite.imgSrc}" width="600" height="400">
//         `;
//       } catch (error) {
//         satelliteDisplay.innerHTML = "Satellite not found.";
//       }
//     });

//     // Handle Visible Satellites for Given Location
//     const locationForm = document.getElementById("location-form");
//     locationForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const latitude = document.getElementById("latitude").value;
//       const longitude = document.getElementById("longitude").value;
//       const displayObjects = document.getElementById("visible-sats");
      
//       try {
//         const visibleSatellites = await getVisibleSatellites(latitude, longitude, 0);
//         let content = "<b>Visible objects in the sky:</b><br><br>";
//         visibleSatellites.forEach((sat, index) => {
//           content += `(${index + 1}) ${sat.name}<br>
//             Orbital Velocity: ${sat.velocity} km/h<br>
//             Altitude: ${sat.alt} km<br><br>`;
//         });
//         displayObjects.innerHTML = content;
//       } catch (error) {
//         displayObjects.innerHTML = "Error fetching visible satellites.";
//       }
//     });
//   });
