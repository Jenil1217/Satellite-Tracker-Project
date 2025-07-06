import * as satellite from 'satellite.js';
const { twoline2satrec, propagate, gstime, eciToGeodetic } = satellite;

export const calculateOrbit = (tleString) => {
  if (!tleString) return [];

  const lines = tleString.split(/\r?\n/);
  if (lines.length < 2) return [];

  const [line1, line2] = lines;
  const satrec = twoline2satrec(line1, line2);

  const now = new Date();
  const allSegments = [];
  let segment = [];

  let prevLon = null;

  for (let i = 0; i <= 5400; i += 60) {
    const time = new Date(now.getTime() + i * 1000);
    const posVel = propagate(satrec, time);

    if (posVel.position) {
      const { x, y, z } = posVel.position;
      const gmst = gstime(time);
      const { longitude, latitude } = eciToGeodetic({ x, y, z }, gmst);

      const latDeg = latitude * (180 / Math.PI);
      const lonDeg = longitude * (180 / Math.PI);

      // Check for jump across ±180°
      if (
        prevLon !== null &&
        Math.abs(lonDeg - prevLon) > 180
      ) {
        allSegments.push(segment);
        segment = [];
      }

      segment.push([latDeg, lonDeg]);
      prevLon = lonDeg;
    }
  }

  if (segment.length > 0) {
    allSegments.push(segment);
  }

  return allSegments; // Array of line segments
};
