const express = require('express');
const app = express();
const rp = require('request-promise');
const port = process.env.PORT || 1122;
const wmata = require('./apis/wmata');
const metro = require('./controllers/metro');
const cors = require('cors');
app.use(cors({ origin: true }));

// two letter abbreviation for lines accepted by WMATA API
const metroLines = ['RD', 'BL', 'YL', 'OR', 'GR', 'SV'];

/**
 * middleware to log requests
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 * @return {[type]}
 */
const requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  console.log('method ' + req.method + ' and url ' + req.url);
  console.log('request came across at ' + req.requestTime);
  next();
};
app.use(requestTime);

/**
 * Station List
 * Returns an array of stations for the silver line
 * Requires a LineCode as a query string in the request
 * If LineCode is not found in the metroLines array above, an error is thrown
 * @type array
 */
app.get('/station-list', async (req, res) => {
  try {
    if (!metroLines.includes(req.query.LineCode)) {
      const lineCodeError = new Error(
        'LineCode must be RD, BL, YL, OR, GR, or SV'
      );
      throw lineCodeError;
    }

    const response = await metro.getStationList(req.query.LineCode);
    res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Station Information
 * Returns general information on the specified station including address
 * Requires StationCode as a query string in the request
 * If no value is provided for StationCode, an error is thrown
 * Call the WMATA station list endpoint to get a list of the station codes that are acceptable
 * @type {object}
 */
app.get('/station-information', async (req, res) => {
  try {
    if (req.query.StationCode === undefined) {
      const stationCodeError = new Error(
        'StationCode must be included as a query string in the request'
      );
      throw stationCodeError;
    }

    const times = await metro.getStationInformation(req.query.StationCode);
    res.status(200).send(times);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Station Hours
 * returns the start and stop times for trains at the specified station
 * Requires StationCode as a query string in the request
 * If StationCode is not provided, an error is thrown
 * Call the WMATA station list endpoint to get a list of the station codes that are acceptable
 * @type {Object}
 */
app.get('/station-hours', async (req, res) => {
  try {
    if (req.query.StationCode === undefined) {
      const stationCodeError = new Error(
        'StationCode must be included as a query string in the request'
      );
      throw stationCodeError;
    }

    const times = await metro.getStationHours(req.query.StationCode);
    res.status(200).send(times);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Arrival Times
 * Provides the predicted arrival times for the specified station
 * Requires StationCode as a query string in the request
 * If StationCode is not provided, an error is thrown
 * Call the WMATA station list endpoint to get a list of the station codes that are acceptable
 * @type {[type]}
 */
app.get('/arrival-times', async (req, res) => {
  try {
    if (req.query.StationCode === undefined) {
      const stationCodeError = new Error(
        'StationCode must be included as a query string in the request'
      );
      throw stationCodeError;
    }

    const arrivalTimes = await metro.getArrivalTimes(req.query.StationCode);
    res.status(200).send(arrivalTimes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Station Route
 * Returns a list ordered list (from first to last) of the standard route for the specified line
 * Requires a LineCode as a query string in the request
 * If LineCode is not found in the metroLines array above, an error is thrown
 * @type {[type]}
 */
app.get('/station-route', async (req, res) => {
  try {
    if (!metroLines.includes(req.query.LineCode)) {
      const lineCodeError = new Error(
        'LineCode must be RD, BL, YL, OR, GR, or SV'
      );
      throw lineCodeError;
    }

    const stationRoute = await metro.getStationRoute(req.query.LineCode);
    res.status(200).send(stationRoute);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port);

module.exports = app;
