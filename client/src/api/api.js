import axios from 'axios';
const token = localStorage.getItem('token');

const api = {
  // 🌍 Get list of satellites for dropdown
  getAllSatellites: async () => {
    const res = await axios.get('/satellites');  // ❗ No /api prefix
    return res.data;
  },

  // 🛰️ Get satellite position based on ID and location
  getSatellitePosition: async (id, lat, lon, alt = 0, seconds = 10) => {
    const res = await axios.get(`/positions/${id}/${lat}/${lon}/${alt}/${seconds}`);
    return res.data;
  },

  // 🔭 Optional: fetch visible satellites (not used in Home currently)
  getVisibleSatellites: async (lat, lon, cat = 0) => {
    const res = await axios.get('/visible-satellites', {
      params: { lat, lon, cat },
    });
    return res.data;
  },

  getTLE: async (norad) => {
  const response = await axios.get(`/tle/${norad}`);
  return response.data;
},

toggleFavorite: async (noradId) => {
    const res = await axios.post(
      `/auth/favorite/${noradId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  getFavorites: async () => {
  const res = await axios.get('/auth/favorites', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return res.data.favorites;
},

};

export default api;
