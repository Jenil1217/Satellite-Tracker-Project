// components/SatCard.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import MapComponent from './Map';
import './SatCard.css';

const SatCard = ({
  sat, // full satellite object (name, id, position, orbit)
  userCoords = null,
  favorites = [],
  setFavorites = () => {},
  onUnfollow = null,
  showMap = true
}) => {
  const { user } = useContext(AuthContext);

  const satId = sat.id || sat.satid || sat.NORAD_CAT_ID;

  const handleFollowToggle = async () => {
    try {
      const updated = await api.toggleFavorite(satId);
      setFavorites(updated);

      if (onUnfollow && !updated.includes(satId)) {
        onUnfollow(satId); // parent can remove it from list
      }
    } catch (err) {
      console.error('Favorite toggle failed', err);
    }
  };

  return (
    <div className="sat-card">
      <div className="sat-info">
        <h2>{sat.name || sat.satname || sat.OBJECT_NAME}</h2>
        <p><strong>NORAD ID:</strong> {satId}</p>
        <p><strong>Latitude:</strong> {sat.position?.satlatitude?.toFixed(2) ?? '-'}</p>
        <p><strong>Longitude:</strong> {sat.position?.satlongitude?.toFixed(2) ?? '-'}</p>
        <p><strong>Altitude:</strong> {sat.position?.sataltitude?.toFixed(2) ?? '-'} km</p>
        {sat.position?.azimuth && (
          <>
            <p><strong>Azimuth:</strong> {sat.position.azimuth.toFixed(2)}°</p>
            <p><strong>Elevation:</strong> {sat.position.elevation.toFixed(2)}°</p>
          </>
        )}

        {user ? (
          <button onClick={handleFollowToggle} className="btn small">
            {Array.isArray(favorites) && favorites.includes(satId)
              ? '★ Unfollow'
              : '☆ Follow'}
          </button>
        ) : (
          <p style={{ fontSize: '12px', color: '#999' }}>
            Login to follow satellites
          </p>
        )}
      </div>

      {showMap && sat.position?.satlatitude && (
        <div className="map-wrapper">
          <MapComponent
            data={[{
              satname: sat.name || sat.satname,
              satlatitude: sat.position.satlatitude,
              satlongitude: sat.position.satlongitude
            }]}
            user={userCoords}
            orbit={sat.orbit || []}
          />
        </div>
      )}
    </div>
  );
};

export default SatCard;
