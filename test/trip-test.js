import chai from 'chai';
const expect = chai.expect;
import { destinations, trips, travelers } from './test-data.js';
import TripRepo from '../src/TripRepo.js';

describe('TripRepo', () => {
  let trip = null;

  beforeEach( () => {
    trip = new Trip(trips[3]);
  });

  it('should be a function', function () {
    expect(Trip).to.be.a('function');
  });

  it('should be an instance of Trips', function () {
    expect(trip).to.be.an.instanceof(Trip);
  });

});
