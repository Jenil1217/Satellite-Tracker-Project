import axios from 'axios';

const api = {
  getVisibleSatellites: async (lat, lon) => {
    const res = await axios.get(`/visible-satellites`, {
      params: { lat, lon },
    });
    return res.data;
  },

  getSatellitePosition: async (id, lat, lon, alt = 0, seconds = 10) => {
    const res = await axios.get(`/positions/${id}/${lat}/${lon}/${alt}/${seconds}`);
    return res.data;
  },
};

export default api;
