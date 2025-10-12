import stationsData from '../data/stations.json';

/**
 * Get all unique stations from all lines
 * @returns {Array<string>} Array of unique station names
 */
export const getAllStations = () => {
  const stationsSet = new Set();

  Object.values(stationsData.lines).forEach(line => {
    line.stations.forEach(station => {
      stationsSet.add(station);
    });
  });

  return Array.from(stationsSet).sort();
};

/**
 * Search stations by query string
 * @param {string} query - Search query
 * @param {string} [lineName] - Optional line name to filter by
 * @returns {Array<string>} Array of matching station names
 */
export const searchStations = (query, lineName = null) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Get stations based on whether we're filtering by line
  let stationsToSearch;
  if (lineName && stationsData.lines[lineName]) {
    stationsToSearch = stationsData.lines[lineName].stations;
  } else {
    stationsToSearch = getAllStations();
  }

  return stationsToSearch.filter(station =>
    station.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get stations by line name
 * @param {string} lineName - Line name
 * @returns {Array<string>} Array of station names for the line
 */
export const getStationsByLine = (lineName) => {
  const line = stationsData.lines[lineName];
  return line ? line.stations : [];
};

/**
 * Get all line names
 * @returns {Array<string>} Array of line names
 */
export const getAllLines = () => {
  return Object.keys(stationsData.lines);
};

/**
 * Get lines that include a specific station
 * @param {string} stationName - Station name
 * @returns {Array<string>} Array of line names
 */
export const getLinesByStation = (stationName) => {
  const lines = [];

  Object.entries(stationsData.lines).forEach(([lineName, lineData]) => {
    if (lineData.stations.includes(stationName)) {
      lines.push(lineName);
    }
  });

  return lines;
};

/**
 * Get initial stations to display (for empty search)
 * @param {string} [lineName] - Optional line name to filter by
 * @param {number} [limit=15] - Maximum number of stations to return
 * @returns {Array<string>} Array of station names
 */
export const getInitialStations = (lineName = null, limit = 15) => {
  if (lineName && stationsData.lines[lineName]) {
    return stationsData.lines[lineName].stations.slice(0, limit);
  }
  return getAllStations().slice(0, limit);
};
