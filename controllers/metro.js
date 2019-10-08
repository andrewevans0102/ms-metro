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
  stationList.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
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
  const formattedTimes = [];
  const emptyHours = '00:00';
  if (times.Monday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Monday',
      opening: convert24To12Hour(times.Monday.OpeningTime),
      firstTrain: convert24To12Hour(times.Monday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Monday.LastTrains[0].Time)
    });
  }
  if (times.Tuesday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Tuesday',
      opening: convert24To12Hour(times.Tuesday.OpeningTime),
      firstTrain: convert24To12Hour(times.Tuesday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Tuesday.LastTrains[0].Time)
    });
  }
  if (times.Wednesday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Wednesday',
      opening: convert24To12Hour(times.Wednesday.OpeningTime),
      firstTrain: convert24To12Hour(times.Wednesday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Wednesday.LastTrains[0].Time)
    });
  }
  if (times.Thursday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Thursday',
      opening: convert24To12Hour(times.Thursday.OpeningTime),
      firstTrain: convert24To12Hour(times.Thursday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Thursday.LastTrains[0].Time)
    });
  }
  if (times.Friday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Friday',
      opening: convert24To12Hour(times.Friday.OpeningTime),
      firstTrain: convert24To12Hour(times.Friday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Friday.LastTrains[0].Time)
    });
  }
  if (times.Saturday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Saturday',
      opening: convert24To12Hour(times.Saturday.OpeningTime),
      firstTrain: convert24To12Hour(times.Saturday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Saturday.LastTrains[0].Time)
    });
  }
  if (times.Sunday.OpeningTime !== emptyHours) {
    formattedTimes.push({
      day: 'Sunday',
      opening: convert24To12Hour(times.Sunday.OpeningTime),
      firstTrain: convert24To12Hour(times.Sunday.FirstTrains[0].Time),
      lastTrain: convert24To12Hour(times.Sunday.LastTrains[0].Time)
    });
  }
  return formattedTimes;
};

function convert24To12Hour(timeInput) {
  const hoursString = timeInput.substring(0, 2);
  const minutesString = timeInput.substring(3, 5);
  let hoursNumber = parseInt(hoursString, 10);
  if (hoursNumber > 12) {
    hoursNumber = hoursNumber - 12;
    return hoursNumber.toString() + ':' + minutesString + ' pm';
  } else if (hoursNumber === 12) {
    return hoursNumber.toString() + ':' + minutesString + ' pm';
  } else {
    return timeInput + ' am';
  }
}

controllers.getArrivalTimes = async stationCode => {
  const response = await wmata.nextTrains(stationCode);
  const { Trains: arrivalTimes } = response;
  return arrivalTimes;
};

controllers.getStationRoute = async LineCode => {
  const route = await wmata.standardRoutes(LineCode);
  const stations = await wmata.stationList(LineCode);

  const stationRoute = [];
  // start counting at 1 here since this will be displayed
  let stationOrder = 1;
  route.forEach(routeStop => {
    if (routeStop.StationCode !== null) {
      const stationName = stations.find(station => {
        return station.Code === routeStop.StationCode;
      });

      const savedStation = {
        name: stationName.Name,
        code: routeStop.StationCode,
        order: stationOrder
      };
      stationOrder++;
      stationRoute.push(savedStation);
    }
  });
  return stationRoute;
};

module.exports = controllers;
