import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000';

const api = {
  // 🌍 Get list of satellites for dropdown
  
  getAllSatellites: async () => {
    const res = await axios.get('/satellites');
    return res.data;
  },

  // 🛰️ Get satellite position based on ID and location
  getSatellitePosition: async (id, lat, lon, alt = 0, seconds = 10) => {
    const res = await axios.get(`/positions/${id}/${lat}/${lon}/${alt}/${seconds}`);
    return res.data;
  },

  // 🔭 Fetch visible satellites
  getVisibleSatellites: async (lat, lon, cat = 0) => {
    const res = await axios.get('/visible-satellites', {
      params: { lat, lon, cat },
    });
    return res.data;
  },

  getTLE: async (norad) => {
    const res = await axios.get(`/tle/${norad}`);
    return res.data;
  },

  // 🔑 Login
  login: async (email, password) => {
    const res = await axios.post("/auth/login", { email, password });
    return res.data; // { token, username }
  },

  // ⭐ Get favorite satellites
  getFavorites: async () => {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage:", token); // 🔍 Debug log
  
  if (!token) {
    throw new Error("No token found");
  }
  
  const res = await axios.get("/auth/favorites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
},

  // 🔁 Toggle favorite
  toggleFavorite: async (noradId) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(`/auth/favorite/${noradId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

export default api;
