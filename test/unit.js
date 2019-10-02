const metro = require('../controllers/metro');
const sinon = require('sinon');
const wmata = require('../apis/wmata');
const chai = require('chai');
const expect = chai.expect;
// wmata mocks
const wmataStationListMock = require('../mocks/wmata/station-list.json');
const wmataStationInformationMock = require('../mocks/wmata/station-information.json');
const wmataStationTimingsMock = require('../mocks/wmata/station-timings.json');
const wmataNextTrainsMock = require('../mocks/wmata/next-trains.json');
const wmataStandardRoutesMock = require('../mocks/wmata/standard-routes.json');
// metro mocks
const metroStationListMock = require('../mocks/metro/station-list.json');
const metroStationInformationMock = require('../mocks/wmata/station-information.json');
const metroStationHoursMock = require('../mocks/metro/station-hours.json');
const metroArrivalTimesMock = require('../mocks/metro/arrival-times.json');
const metroStationRouteMock = require('../mocks/metro/station-route.json');

describe('Station List', function() {
  afterEach(function() {
    wmata.stationList.restore();
  });
  it('should return station list when called', async function() {
    const lineCode = 'SV';
    const stationListStub = sinon
      .stub(wmata, 'stationList')
      .withArgs(lineCode)
      .returns(wmataStationListMock);
    const response = await metro.getStationList(lineCode);
    expect(response).to.deep.equal(metroStationListMock);
  });
});

describe('Station Information', function() {
  afterEach(function() {
    wmata.stationInformation.restore();
  });
  it('should return station information when called', async function() {
    const lineCode = 'SV';
    const stationListStub = sinon
      .stub(wmata, 'stationInformation')
      .withArgs(lineCode)
      .returns(wmataStationInformationMock);
    const response = await metro.getStationInformation(lineCode);
    expect(response).to.deep.equal(metroStationInformationMock);
  });
});

describe('Station Hours', function() {
  let validStationTimingsStub;
  const stationCode = 'K05';

  afterEach(function() {
    wmata.stationTimings.restore();
  });

  it('should return station hours when called', async function() {
    validStationTimingsStub = sinon
      .stub(wmata, 'stationTimings')
      .withArgs(stationCode)
      .returns(wmataStationTimingsMock);
    const response = await metro.getStationHours(stationCode);
    expect(response).to.deep.equal(metroStationHoursMock);
  });
});

describe('Arrival Times', function() {
  afterEach(function() {
    wmata.nextTrains.restore();
  });

  it('should return arrival times when called with a valid station code value', async function() {
    const validCode = 'K05';
    const validArrivalTimesStub = sinon
      .stub(wmata, 'nextTrains')
      .withArgs(validCode)
      .returns(wmataNextTrainsMock);
    const response = await metro.getArrivalTimes(validCode);
    expect(response).to.deep.equal(metroArrivalTimesMock);
  });
});

describe('Station Route', function() {
  afterEach(function() {
    wmata.standardRoutes.restore();
    wmata.stationList.restore();
  });

  it('should return the station route when called', async function() {
    const lineCode = 'SV';
    const standardRoutesStub = sinon
      .stub(wmata, 'standardRoutes')
      .returns(wmataStandardRoutesMock);
    const stationInformationStub = sinon
      .stub(wmata, 'stationList')
      .withArgs(lineCode)
      .returns(wmataStationListMock);
    const response = await metro.getStationRoute(lineCode);
    expect(response).to.deep.equal(metroStationRouteMock);
  });
});
