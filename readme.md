# Satellite Tracker Web Application

## Project Overview
The Satellite Tracker Web Application provides users with the following functionalities:

1. **Satellite List & Tracking**: Users can select a satellite and retrieve its live TLE (Two-Line Element) data.
2. **Visible Satellites**: Input latitude and longitude to view satellites currently visible in the horizon.
3. **Info Page**: Learn about the project and basic concepts related to astronomy and satellites.

This application is powered by the **N2YO API** for live satellite data, and the backend is built using **Node.js with Express.js**.

---

## Features

### 1. **Home Page**
- Dropdown menu to select a satellite.
- Button to fetch live TLE data for the selected satellite.
- Display of satellite information including launch date and orbit details.

### 2. **Visible Satellites Page**
- Form to input latitude, longitude, and altitude.
- Fetches and displays a list of satellites visible from the given location using real-time data.

### 3. **Info Page**
- Static page with details about the project and general astronomy information.

---

## Project Structure
```
project/
├── public/
│   ├── index.html          (Homepage: Satellite List & Tracking)
│   ├── visible.html        (Visible Satellites Page)
│   ├── info.html           (Info Page)
│   ├── styles.css          (CSS for all pages)
│   └── script.js           (JavaScript for handling frontend logic)
│
├── server.js               (Express.js Server with API integration for N2YO)
├── package.json            (Dependencies and scripts)
└── README.md               (Documentation)
```

---

## Installation

1. Clone the repository:
```bash
git clone <repository_url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open the application in your browser:
- Home: [http://localhost:3000/](http://localhost:3000/)
- Visible Satellites: [http://localhost:3000/visible](http://localhost:3000/visible)
- Info Page: [http://localhost:3000/info](http://localhost:3000/info)

---

## Usage

### Home Page
1. Navigate to the home page.
2. Select a satellite from the dropdown menu.
3. Click "Track Satellite" to fetch and display live TLE data.

### Visible Satellites
1. Navigate to the visible satellites page.
2. Enter latitude, longitude, and altitude.
3. Click "Find Satellites" to get the list of visible satellites in real-time.

### Info Page
- Read about the project and related astronomy information.

---

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **API**: N2YO API for live satellite data

---

## Future Enhancements
1. **Real-Time Position Tracking**: Calculate and display the real-time position of satellites using TLE data.
2. **User Accounts**: Allow users to create accounts and save their favourite satellites.
3. **Orbit Visualization**: Add a map-based visualization of satellite orbits using libraries like Leaflet.js.
4. **Notification System**: Notify users when specific satellites are visible at their location.

---

## License
This project is open-source and available under the MIT License.

---

## Contributors
- [Your Name] - Developer

---

## Acknowledgments
- **N2YO**: For live satellite data.
- **Open-Source Libraries**: For powering the backend and frontend.

