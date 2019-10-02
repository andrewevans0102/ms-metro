const rp = require('request-promise');

/**
 * Station List
 * https://developer.wmata.com/docs/services/5476364f031f590f38092507/operations/5476364f031f5909e4fe3311?
 * @param  {[type]}  LineCode
 * @return {Promise}
 */
const stationList = async LineCode => {
  if (process.env.MOCK_SERVER) {
    return mockServer('http://localhost:3000/station-list');
  }

  const options = {
    uri: 'https://api.wmata.com/Rail.svc/json/jStations',
    qs: {
      LineCode: LineCode
    },
    headers: {
      api_key: process.env.WMATA_API_SECRET_KEY
    },
    json: true
  };
  const response = await rp(options);
  const { Stations: stations } = response;
  return stations;
};

/**
 * Station Information
 * https://developer.wmata.com/docs/services/5476364f031f590f38092507/operations/5476364f031f5909e4fe3310?
 * @param  {[type]}  StationCode
 * @return {Promise}
 */
const stationInformation = async StationCode => {
  if (process.env.MOCK_SERVER) {
    return mockServer('http://localhost:3000/station-information');
  }

  const options = {
    uri: 'https://api.wmata.com/Rail.svc/json/jStationInfo',
    qs: {
      StationCode: StationCode
    },
    headers: {
      api_key: process.env.WMATA_API_SECRET_KEY
    },
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * station timings
 * https://developer.wmata.com/docs/services/5476364f031f590f38092507/operations/5476364f031f5909e4fe3312?
 * @param  {[type]} StationCode
 * @return {[type]}
 */
const stationTimings = StationCode => {
  if (process.env.MOCK_SERVER) {
    return mockServer('http://localhost:3000/station-timings');
  }

  const options = {
    uri: 'https://api.wmata.com/Rail.svc/json/jStationTimes',
    qs: {
      StationCode: StationCode
    },
    headers: {
      api_key: process.env.WMATA_API_SECRET_KEY
    },
    json: true
  };
  return rp(options);
};

/**
 * next trains
 * https://developer.wmata.com/docs/services/547636a6f9182302184cda78/operations/547636a6f918230da855363f
 * @param  {[type]} stationCode
 * @return {[type]}
 */
const nextTrains = stationCode => {
  if (process.env.MOCK_SERVER) {
    // here an environment variable is used to determine which value the mock server retrieves
    if (process.env.ARRIVAL_TIME === 'C02') {
      return mockServer('http://localhost:3000/C02-times');
    } else {
      return mockServer('http://localhost:3000/next-trains');
    }
  }

  const options = {
    uri:
      'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/' +
      stationCode,
    headers: {
      api_key: process.env.WMATA_API_SECRET_KEY
    },
    json: true
  };

  return rp(options);
};

/**
 * standard routes
 * https://developer.wmata.com/docs/services/5763fa6ff91823096cac1057/operations/57641afc031f59363c586dca?
 * @param  {[type]}  LineCode
 * @return {Promise}
 */
const standardRoutes = async LineCode => {
  if (process.env.MOCK_SERVER) {
    return mockServer('http://localhost:3000/standard-routes');
  }

  // first get standard routes
  const options = {
    uri: 'https://api.wmata.com/TrainPositions/StandardRoutes?contentType=json',
    headers: {
      api_key: process.env.WMATA_API_SECRET_KEY
    },
    json: true
  };
  const response = await rp(options);
  const { StandardRoutes: routes } = response;
  const silverLine = routes.filter(route => route.LineCode === LineCode);
  // there are two trains that are returned, 1 for each direction
  // only return the first one here, the routes are the same for both
  const route = silverLine[0].TrackCircuits;
  return route;
};

/**
 * mock server
 * here this method is called when running integration tests to determine which mock for the server to retrieve
 * @param  {[type]}  jsonLocation
 * @return {Promise}
 */
const mockServer = async jsonLocation => {
  const options = {
    uri: jsonLocation,
    json: true
  };
  return rp(options);
};

module.exports = {
  stationList,
  stationInformation,
  stationTimings,
  nextTrains,
  standardRoutes
};
