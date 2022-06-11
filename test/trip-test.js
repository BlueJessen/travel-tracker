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

  it('should be an instance of Trip', function () {
    expect(trip).to.be.an.instanceof(Trip);
  });

  it('should have an ID', function () {
    expect(trip.id).to.equal(4);
  });

  it('should have a users ID', function () {
    expect(trip.userID).to.equal(2);
  });

  it('should have a destinationID', function () {
    expect(trip.destinationID).to.equal(2);
  });

  it('should have travelers', function () {
    expect(trip.travelers).to.equal(2);
  });

  it('should have a date', function () {
    expect(trip.date).to.equal('2022/02/25');
  });

  it('should have a duration', function () {
    expect(trip.duration).to.equal(10);
  });

  it('should have a status', function () {
    expect(trip.status).to.equal(2);
  });

  it('should have suggested activties', function () {
    expect(trip.suggestedActivities).to.deep.equal([]);
  });

});
