import { useState } from 'react';
import api from '../api';// Add this line for CSS import
import "../App.css";


const Visible = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [satellites, setSatellites] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState('');

  const handleLocationFetch = async () => {
    try {
      const { coords } = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setLat(coords.latitude.toFixed(6));
      setLon(coords.longitude.toFixed(6));
    } catch {
      setError('Location fetch failed. Please enable location access.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lat || !lon) {
      setError('Please enter valid latitude and longitude');
      return;
    }

    try {
      const data = await api.getVisibleSatellites(lat, lon);
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
      setModalData({
        name: data.info.satname,
        id: data.info.satid,
        position: data.positions[0],
      });
    } catch (err) {
      setError('Failed to fetch satellite details');
    }
  };

  const closeModal = () => setModalData(null);

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

      {modalData && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalData.name}</h2>
            <p><strong>NORAD ID:</strong> {modalData.id}</p>
            <p><strong>Latitude:</strong> {modalData.position.satlatitude}</p>
            <p><strong>Longitude:</strong> {modalData.position.satlongitude}</p>
            <p><strong>Altitude:</strong> {modalData.position.sataltitude} km</p>
            <p><strong>Azimuth:</strong> {modalData.position.azimuth}°</p>
            <p><strong>Elevation:</strong> {modalData.position.elevation}°</p>
            <button className="btn small" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visible;
