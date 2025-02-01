# Satellite Tracker Web Application

## Project Overview

The Satellite Tracker Web Application is a basic multi-page application that provides users with the following functionalities:

1. **Satellite List & Tracking**: Select a satellite from a dropdown menu and track its details.
2. **Visible Satellites**: Input latitude and longitude to view satellites visible in the horizon.
3. **Info Page**: Learn about the project and general astronomy-related information.

This application is hosted using an Express.js backend and includes a frontend built with HTML, CSS, and JavaScript.

---

## Features

### 1. **Home Page**

- Dropdown menu to select a satellite.
- Button to track the selected satellite.
- Display satellite information dynamically.

### 2. **Visible Satellites Page**

- Form to input latitude and longitude.
- Displays a list of satellites visible from the given coordinates.

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
│   └── script.js           (JavaScript for all pages)
│
├── server.js               (Express.js Server)
├── package.json            (Dependencies)
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
3. Click "Track Satellite" to view its details.

### Visible Satellites

1. Navigate to the visible satellites page.
2. Enter latitude and longitude.
3. Click "Find Satellites" to get the list of visible satellites.

### Info Page

- Read about the project and related astronomy information.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js

---

## Future Enhancements

1. **Real-Time Tracking**: Add dynamic updates for satellite positions.
2. **Satellite API Integration**: Use APIs like NORAD's TLE data to fetch live satellite data.
3. **User Authentication**: Allow users to save and manage their favorite satellites.
4. **Advanced Visualizations**: Add orbit visualizations (without maps).

---

## License

This project is open-source and available under the MIT License.

---

## Contributors

- [Your Name] - Developer

---

## Acknowledgments

- **NORAD**: For TLE data.
- **Open-Source Libraries**: For powering the backend and frontend.

