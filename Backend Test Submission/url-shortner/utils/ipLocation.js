async function getLocationFromIP(ip) {
  // Fake mapping for demonstration
  if (ip.includes("127") || ip.includes("localhost")) return "Localhost";
  if (ip.startsWith("122.")) return "India";
  if (ip.startsWith("104.")) return "USA";
  return "Unknown";
}

module.exports = getLocationFromIP;
