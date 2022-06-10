import chai from 'chai';
const expect = chai.expect;
import { destinations, trips, travelers } from './test-data.js';
import Trips from '../src/Trips.js';

describe('Trips', () => {
  let tripRepo = null;

  beforeEach( () => {
    tripRepo = new Trips(trips);
  });

  it('should be a function', function () {
    expect(Trips).to.be.a('function');
  });

  it('should be an instance of Trips', function () {
    expect(tripRepo).to.be.an.instanceof(Trips);
  });

  it('should be able to find trip by id', function () {
    expect(tripRepo.findTrip(4)).to.be.equal(trips[3]);
  });

  it('should be able to find trip by user id', function () {
    expect(tripRepo.findTripByUser(2)).to.be.equal(trips[3]);
  });

  it('should be able to find all trips by a user', function () {
    expect(tripRepo.findAllTripsByUser(2)).to.be.equal([trips[3],trips[0]]);
  });

  it('should have an id', function () {
    expect
  });

});
