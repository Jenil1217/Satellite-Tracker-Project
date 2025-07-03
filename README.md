# 🛰️ Satellite Tracker Web App

This is a full-stack web application that allows users to search, track, and view real-time position data of satellites using NORAD catalog numbers. It uses the N2YO API for satellite data and stores satellite info locally in MongoDB for faster future queries. The app includes a smart search box that loads satellites from the local MongoDB database and allows users to manually enter NORAD IDs to fetch and store new satellite data.

## Features

- Search satellites by name or NORAD ID
- Track satellite position using user's geolocation
- Store satellite data in MongoDB for faster access
- Automatically fetch missing satellites from N2YO using NORAD ID
- Uses React for frontend, Express.js for backend, MongoDB for storage, and Axios for API requests

## Tech Stack

Frontend: React (with Vite)

Backend: Express.js (Node.js)

Database: MongoDB

APIs: N2YO API

## Project Structure

project-root/
## Project Structure

- `client/` – React frontend
  - `src/`
    - `components/` – React components
    - `api/api.js` – Frontend API utility
    - `App.jsx` – Main application component
  - `public/` – Static assets

- `server/` – Express backend
  - `models/` – Mongoose models
  - `routes/` – Express route handlers
  - `server.js` – Main server entry point

- `.env` – Environment variables (Mongo URI, N2YO API key)
- `README.md` – Project documentation


## Setup Instructions

1. Clone the repository:

git clone https://github.com/your-username/satellite-tracker.git
cd satellite-tracker

2. Install dependencies:

Frontend:
cd client
npm install

Backend:
cd ../server
npm install

3. Configure environment variables:

Create a `.env` file inside the `server/` folder with:
MONGO_URI=mongodb://127.0.0.1:27017/satellites
N2YO_API_KEY=your_n2yo_api_key

4. Start the servers:

Start backend:
cd server
npm run dev

Start frontend:
cd ../client
npm run dev

The frontend will be available at http://localhost:5173 and backend at http://localhost:3000

## Manual Satellite Entry

If a satellite is not found in the dropdown, enter the NORAD catalog number manually. The system will fetch its data from N2YO and add it to MongoDB for future access.

## License

This project is licensed under the MIT License.

## Author

Built by Jenil Patel — https://github.com/Jenil1217
