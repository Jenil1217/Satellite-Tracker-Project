import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import MapComponent from '../components/Map.jsx';
import { calculateOrbit } from '../utils/orbit';

const Info = () => {
  const { user, logout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [selectedSatData, setSelectedSatData] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const loadFavorites = async () => {
        try {
          const favObjects = await api.getFavorites(); // [{ id, name }]
          setFavorites(favObjects);
        } catch (err) {
          console.error('Failed to load favorites:', err);
        }
      };
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserCoords({ lat: coords.latitude, lon: coords.longitude });
      },
      err => console.error('Failed to get location', err)
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTrack = async (noradId) => {
    try {
      if (!userCoords) {
        alert('Waiting for location...');
        return;
      }

      const res = await api.getSatellitePosition(noradId, userCoords.lat, userCoords.lon);
      const tleData = await api.getTLE(noradId);
      const orbitPath = calculateOrbit(tleData.tle);

      setSelectedSatData({
        ...res,
        orbit: orbitPath,
      });
    } catch (err) {
      console.error('Failed to fetch satellite data', err);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      await api.toggleFavorite(id); // 🛰️ toggle on backend
      const updated = await api.getFavorites(); // 🔁 re-fetch updated list
      setFavorites(updated); // ✅ ensures synced with DB

    } catch (err) {
      console.error('Failed to unfollow', err);
    }
  };

  return (
    <div className="container">
      <h1>📡 Satellite Tracker Project</h1>
      <p>This project allows real-time satellite tracking with orbit trails using TLE data. Built with React, MongoDB, Express, and satellite.js.</p>
      <hr />

      {user ? (
        <div>
          <h2>👤 Profile</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Favorites:</strong> {favorites.length}</p>

          {favorites.length > 0 ? (
            <>
              <h3>Your Satellites</h3>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {favorites.map((sat) => (
                  <li key={sat.id} style={{ marginBottom: '10px', background: '#161b22', padding: '10px', borderRadius: '8px' }}>
                    <strong style={{ color: '#58a6ff' }}>{sat.name}</strong> (NORAD: {sat.id})
                    <div style={{ marginTop: '5px' }}>
                      <button
                        onClick={() => handleTrack(sat.id)}
                        className="btn small"
                        style={{ marginRight: '8px' }}
                      >
                        Track
                      </button>
                      <button
                        onClick={() => handleUnfollow(sat.id)}
                        className="btn small danger"
                      >
                        Unfollow
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p style={{ fontSize: '14px', color: '#999' }}>No favorites yet. Start following from the satellite list!</p>
          )}

          <button className="btn secondary" onClick={handleLogout}>Logout</button>
          <Link to="/" className="btn small" style={{ marginLeft: '10px' }}>Home</Link>
        </div>
      ) : (
        <div>
          <h2>👤 Guest Access</h2>
          <p>You are currently not logged in.</p>
          <Link to="/login" className="btn primary">Login</Link>
        </div>
      )}

      {/* 🛰️ Tracking Result */}
      {selectedSatData && (
        <>
          <div className="card">
            <h2>{selectedSatData.info.satname}</h2>
            <p><strong>Latitude:</strong> {selectedSatData.positions[0].satlatitude}</p>
            <p><strong>Longitude:</strong> {selectedSatData.positions[0].satlongitude}</p>
            <p><strong>Altitude:</strong> {selectedSatData.positions[0].sataltitude} km</p>
          </div>
          <MapComponent
            data={[{
              satname: selectedSatData.info.satname,
              satlatitude: selectedSatData.positions[0].satlatitude,
              satlongitude: selectedSatData.positions[0].satlongitude,
            }]}
            user={userCoords}
            orbit={selectedSatData.orbit}
          />
        </>
      )}
    </div>
  );
};

export default Info;
