import { useState } from 'react';
import api from '../api';
import "../App.css";

const demoSatellites = [
  { id: 25544, name: 'ISS' },
  { id: 48274, name: 'Starlink 1000' },
];

const Home = () => {
  const [selectedId, setSelectedId] = useState(demoSatellites[0].id);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      const { coords } = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const res = await api.getSatellitePosition(
        selectedId,
        coords.latitude,
        coords.longitude
      );

      setData(res);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching satellite data');
    }
  };

  return (
    <div className='container'>
      <h1>Satellite Tracker - Home</h1>
      <select className="dropdown" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        {demoSatellites.map((sat) => (
          <option key={sat.id} value={sat.id}>
            {sat.name}
          </option>
        ))}
      </select>
      <button className = 'btn primary'onClick={handleTrack}>Track</button>

      {error && <p className="error"  style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div className="card">
          <h2>{data.info.satname}</h2>
          <p>Latitude: {data.positions[0].satlatitude}</p>
          <p>Longitude: {data.positions[0].satlongitude}</p>
          <p>Altitude: {data.positions[0].sataltitude} km</p>
        </div>
      )}
    </div>
  );
};

export default Home;
