// components/MapComponent.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Satellite icon
const satelliteIcon = new L.Icon({
  iconUrl: '/image.png', // make sure it's in public/
  iconSize: [25, 25],
  iconAnchor: [17, 17],
  popupAnchor: [0, -50]
});

// User icon (small red dot)
const userDotIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: '<div style="width:10px;height:10px;background:#ff0000;border-radius:50%;border:0.5px solid #aa0000;"></div>',
});

const MapComponent = ({ data = [], user = null, orbit = [] }) => {
  if (!data.length && !user) return null;

  const defaultCenter = data.length
    ? [data[0].satlatitude, data[0].satlongitude]
    : [0, 0];

  return (
    <MapContainer center={defaultCenter} zoom={2} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Satellite(s) */}
      {data.map((sat, index) => (
        <Marker
          key={index}
          position={[sat.satlatitude, sat.satlongitude]}
          icon={satelliteIcon}
        >
          <Popup>{sat.satname}</Popup>
        </Marker>
      ))}

      {/* User */}
      {user && (
        <Marker position={[user.lat, user.lon]} icon={userDotIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Orbit path */}
      {Array.isArray(orbit) && orbit.length > 0 &&
        orbit.map((segment, index) => (
          <Polyline key={index} positions={segment} color="cyan" weight={2} />
        ))
      }

    </MapContainer>
  );
};

export default MapComponent;
