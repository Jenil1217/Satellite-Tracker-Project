import { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import api from '../api/api';
import "../App.css";
import MapComponent from "../components/Map.jsx";
import { calculateOrbit } from '../utils/orbit';
import { AuthContext } from '../context/AuthContext';
import SatCard from '../components/SatCard'


const Home = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [satelliteOptions, setSatelliteOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [manualNorad, setManualNorad] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
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
      (err) => console.error("Failed to get user location", err)
    );
  }, []);

  

  // Fetch all satellite options on load
  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const sats = await api.getAllSatellites();
        if (!Array.isArray(sats)) throw new Error('Expected array');

        const options = sats.map(sat => ({
          value: sat.NORAD_CAT_ID,
          label: sat.OBJECT_NAME
        }));

        setSatelliteOptions(options);
        setFilteredOptions(options.slice(0, 20));
        setError('');
      } catch (err) {
        console.error('📡 Satellite fetch error:', err.message);
        setError('Failed to load satellite list');
      }
    };

    fetchSatellites();
  }, []);

  // Triggered on pressing "Track"

  const handleTrack = async () => {
    const noradId = selectedOption?.value || manualNorad;

    if (!noradId) {
      setError('Please select a satellite or enter NORAD number');
      return;
    }

    try {
      const { coords } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const res = await api.getSatellitePosition(noradId, coords.latitude, coords.longitude);
      const tleData = await api.getTLE(noradId);
      const orbitPath = calculateOrbit(tleData.tle);

      setData({ ...res, orbit: orbitPath });
      setError('');
    } catch (err) {
      console.error('🛰️ Position fetch error:', err);
      setError('Error fetching satellite data');
    }
  };


  const handleInputChange = (input) => {
    if (!input) {
      setFilteredOptions(satelliteOptions.slice(0, 20));
      return;
    }

    const matches = satelliteOptions
      .filter(option => option.label.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 20);

    setFilteredOptions(matches);
  };

  return (
    <div className="container">
      <h1>Satellite Tracker - Home</h1>

      <Select
        options={filteredOptions}
        value={selectedOption}
        onChange={setSelectedOption}
        onInputChange={handleInputChange}
        placeholder="Search satellites..."
        className="dropdown"
        isSearchable
        noOptionsMessage={() =>
          satelliteOptions.length === 0 ? 'Loading...' : 'No match found'
        }
      />

      <input
        type="text"
        value={manualNorad}
        onChange={(e) => setManualNorad(e.target.value)}
        placeholder="Or enter NORAD manually"
        className='dropdown'
      />

      <button className="btn primary" onClick={handleTrack} style={{ marginTop: '10px' }}>
        Track
      </button>

      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

      {data && (
      <SatCard
        sat={{
          name: data.info.satname,
          id: data.info.satid || data.info.noradId,
          position: data.positions[0],
          orbit: data.orbit,
        }}
        favorites={favorites}
        setFavorites={setFavorites}
        userCoords={userCoords}
        showMap={true}
      />
    )}

    </div>
  );
};

export default Home;
