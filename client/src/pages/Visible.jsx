import { useState, useEffect, useContext} from 'react';
import api from '../api/api';// Add this line for CSS import
import "../App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapComponent from "../components/Map.jsx";
import { calculateOrbit } from '../utils/orbit';
import { AuthContext } from '../context/AuthContext';

import L from "leaflet";
import { data } from 'react-router-dom';

const categories = [
  { id: 0, name: 'All Categories' },
  { id: 18, name: 'Amateur radio' },
  { id: 35, name: 'Beidou Navigation System' },
  { id: 1, name: 'Brightest' },
  { id: 45, name: 'Celestis' },
  { id: 54, name: 'Chinese Space Station' },
  { id: 32, name: 'CubeSats' },
  { id: 8, name: 'Disaster monitoring' },
  { id: 6, name: 'Earth resources' },
  { id: 29, name: 'Education' },
  { id: 28, name: 'Engineering' },
  { id: 19, name: 'Experimental' },
  { id: 48, name: 'Flock' },
  { id: 22, name: 'Galileo' },
  { id: 27, name: 'Geodetic' },
  { id: 10, name: 'Geostationary' },
  { id: 50, name: 'GPS Constellation' },
  { id: 20, name: 'GPS Operational' },
  { id: 17, name: 'Globalstar' },
  { id: 51, name: 'Glonass Constellation' },
  { id: 21, name: 'Glonass Operational' },
  { id: 5, name: 'GOES' },
  { id: 40, name: 'Gonets' },
  { id: 12, name: 'Gorizont' },
  { id: 11, name: 'Intelsat' },
  { id: 15, name: 'Iridium' },
  { id: 46, name: 'IRNSS' },
  { id: 2, name: 'ISS' },
  { id: 56, name: 'Kuiper' },
  { id: 49, name: 'Lemur' },
  { id: 30, name: 'Military' },
  { id: 14, name: 'Molniya' },
  { id: 24, name: 'Navy Navigation Satellite System' },
  { id: 4, name: 'NOAA' },
  { id: 43, name: 'O3B Networks' },
  { id: 53, name: 'OneWeb' },
  { id: 16, name: 'Orbcomm' },
  { id: 38, name: 'Parus' },
  { id: 55, name: 'Qianfan' },
  { id: 47, name: 'QZSS' },
  { id: 31, name: 'Radar Calibration' },
  { id: 13, name: 'Raduga' },
  { id: 25, name: 'Russian LEO Navigation' },
  { id: 23, name: 'Satellite-Based Augmentation System' },
  { id: 7, name: 'Search & rescue' },
  { id: 26, name: 'Space & Earth Science' },
  { id: 52, name: 'Starlink' },
  { id: 39, name: 'Strela' },
  { id: 9, name: 'Tracking and Data Relay Satellite System' },
  { id: 44, name: 'Tselina' },
  { id: 42, name: 'Tsikada' },
  { id: 41, name: 'Tsiklon' },
  { id: 34, name: 'TV' },
  { id: 3, name: 'Weather' },
  { id: 37, name: 'Westford Needles' },
  { id: 33, name: 'XM and Sirius' },
  { id: 36, name: 'Yaogan' },
];

const Visible = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [satellites, setSatellites] = useState([]);
  const [data, setdata] = useState(null);
  const [error, setError] = useState('');
  const [cat, setSelectedCategory] = useState(1);
  const [userCoords, setUserCoords] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const { user } = useContext(AuthContext);
  useEffect(() => {
      const fetchFavs = async () => {
        try {
          const favs = await api.getFavorites();
          setFavorites(favs);
        } catch (err) {
          console.log('No auth / favs yet');
        }
      };

      fetchFavs();
    }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserCoords({ lat: coords.latitude, lon: coords.longitude });
      },
      (err) => {
        console.error("Failed to get user location", err);
      }
    );
  }, []);

  const handleLocationFetch = () => {
    if (userCoords) {
      setLat(userCoords.lat.toFixed(6));
      setLon(userCoords.lon.toFixed(6));
    } else {
      setError("Location not available yet.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lat || !lon) {
      setError('Please enter valid latitude and longitude');
      return;
    }

    try {
      const data = await api.getVisibleSatellites(lat, lon, cat);
      setSatellites(data.above || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching satellites');
    }
  };

  

  const handlePopup = async (satId) => {
    try {
      const data = await api.getSatellitePosition(satId, lat, lon);
      const tleData = await api.getTLE(satId);
      const orbitPath = calculateOrbit(tleData.tle); // pass full string now


      setdata({
        name: data.info.satname,
        id: data.info.satid,
        position: data.positions[0],
        orbit: orbitPath
      });
    } catch (err) {
      setError('Failed to fetch satellite details');
    }
  };


  const closeModal = () => setdata(null);

  return (
    <div className="visible-container">
      <h1 className="title">Visible Satellites</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={cat}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn primary">Find Satellites</button>
          <button type="button" className="btn secondary" onClick={handleLocationFetch}>
            Auto Fetch Location
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {satellites.length > 0 ? (
          satellites.map((sat) => (
            <div key={sat.satid} className="card">
              <img
                src={`https://placehold.co/400x200?text=${encodeURIComponent(sat.satname)}`}
                alt={sat.satname}
              />
              <h3>{sat.satname}</h3>
              <p>NORAD ID: {sat.satid}</p>
              <button onClick={() => handlePopup(sat.satid)} className="btn small">
                View Info
              </button>
            </div>
          ))
        ) : (
          <p className="info">No satellites found</p>
        )}
      </div>

      {data && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sat-info">
              <h2>{data.name}</h2>
              <p><strong>NORAD ID:</strong> {data.id}</p>
              <p><strong>Latitude:</strong> {data.position.satlatitude}</p>
              <p><strong>Longitude:</strong> {data.position.satlongitude}</p>
              <p><strong>Altitude:</strong> {data.position.sataltitude} km</p>
              <p><strong>Azimuth:</strong> {data.position.azimuth}°</p>
              <p><strong>Elevation:</strong> {data.position.elevation}°</p>
              {user ? (
                <button
                  onClick={async () => {
                    try {
                      const updated = await api.toggleFavorite(data.id); // ✅ this works
                      setFavorites(updated);
                    } catch (err) {
                      console.error('Favorite toggle failed', err);
                    }
                  }}
                  className="btn small"
                >
                  {Array.isArray(favorites) && favorites.includes(data.id)
                    ? '★ Unfollow'
                    : '☆ Follow'}
                </button>
              ) : (
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Login to follow satellites
                </p>
              )}

            </div>

            <div className="map-wrapper">
              <MapComponent
                data={[{
                  satname: data.name,
                  satlatitude: data.position.satlatitude,
                  satlongitude: data.position.satlongitude
                }]}
                user={userCoords}
                orbit={data.orbit}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visible;