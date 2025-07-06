// utils/tleUtils.js
export function getTLEAgeInHours(tleLine1) {
  // Example Line 1: "1 01361U 65034C   25186.71668896  .00000020  00000-0  14574-2 0  9997"
  const epochYear = parseInt("20" + tleLine1.substring(18, 20));
  const dayOfYear = parseFloat(tleLine1.substring(20, 32));

  // Convert TLE epoch to a JS Date
  const epochDate = new Date(Date.UTC(epochYear, 0)); // Jan 1st of epochYear
  epochDate.setUTCDate(epochDate.getUTCDate() + dayOfYear - 1);

  const now = new Date();
  const diffMs = now - epochDate;
  return diffMs / (1000 * 60 * 60); // convert ms to hours
}
