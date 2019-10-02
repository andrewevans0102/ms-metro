const rp = require('request-promise');
const wmata = require('../apis/wmata');

const controllers = {};

/**
 * controller that returns a list of stations based on the line code
 * @param  {[type]}  LineCode possible values include RD, YL, GR, BL, OR, SV
 * @return {Promise} JSON array of station codes and names for the specific line
 */
controllers.getStationList = async LineCode => {
  const response = await wmata.stationList(LineCode);
  const stationList = [];
  response.forEach(station => {
    stationList.push({
      code: station.Code,
      name: station.Name
    });
  });
  return stationList;
};

/**
 * controller that returns the station information based on the station code provided
 * @param  {[type]}  StationCode you can retrieve possible values by calling the WMATA station list endpoint
 * @return {Promise} JSON object station information
 */
controllers.getStationInformation = async StationCode => {
  const response = await wmata.stationInformation(StationCode);
  return response;
};

/**
 * controller that returns the start and stop train times for the specified station
 * @param  {[type]}  StationCode you can retrieve possible values by calling the WMATA station list endpoint
 * @return {Promise}
 */
controllers.getStationHours = async StationCode => {
  const response = await wmata.stationTimings(StationCode);
  const { StationTimes: stationTimes } = response;
  const times = stationTimes[0];
  // create an array of values formatted
  // the times are military but could be converted to 12 hours
  const formattedTimes = [];
  formattedTimes.push({
    day: 'Monday',
    opening: times.Monday.OpeningTime,
    firstTrain: times.Monday.FirstTrains[0].Time,
    lastTrain: times.Monday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Tuesday',
    opening: times.Tuesday.OpeningTime,
    firstTrain: times.Tuesday.FirstTrains[0].Time,
    lastTrain: times.Tuesday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Wednesday',
    opening: times.Wednesday.OpeningTime,
    firstTrain: times.Wednesday.FirstTrains[0].Time,
    lastTrain: times.Wednesday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Thursday',
    opening: times.Thursday.OpeningTime,
    firstTrain: times.Thursday.FirstTrains[0].Time,
    lastTrain: times.Thursday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Friday',
    opening: times.Friday.OpeningTime,
    firstTrain: times.Friday.FirstTrains[0].Time,
    lastTrain: times.Friday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Saturday',
    opening: times.Saturday.OpeningTime,
    firstTrain: times.Saturday.FirstTrains[0].Time,
    lastTrain: times.Saturday.LastTrains[0].Time
  });
  formattedTimes.push({
    day: 'Sunday',
    opening: times.Sunday.OpeningTime,
    firstTrain: times.Sunday.FirstTrains[0].Time,
    lastTrain: times.Sunday.LastTrains[0].Time
  });
  return formattedTimes;
};

controllers.getArrivalTimes = async stationCode => {
  const response = await wmata.nextTrains(stationCode);
  const { Trains: arrivalTimes } = response;
  return arrivalTimes;
};

controllers.getStationRoute = async LineCode => {
  const route = await wmata.standardRoutes(LineCode);
  const stations = await wmata.stationList(LineCode);

  const stationRoute = [];
  let stationOrder = 0;
  route.forEach(routeStop => {
    if (routeStop.StationCode !== null) {
      const stationName = stations.find(station => {
        return station.Code === routeStop.StationCode;
      });

      const savedStation = {
        name: stationName.Name,
        code: routeStop.StationCode
      };
      stationOrder++;
      stationRoute.push(savedStation);
    }
  });
  return stationRoute;
};

module.exports = controllers;
