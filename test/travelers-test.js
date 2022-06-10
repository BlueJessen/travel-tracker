import chai from 'chai';
const expect = chai.expect;
import { destinations, trips, travelers } from './test-data.js';
import Traveler from '../src/Traveler.js';
import TravelerRepo from '../src/TravelerRepo.js';

describe('TravelerRepo', () => {
  let newTravelers = null;

  beforeEach( () => {
    newTravelers = new TravelerRepo(travelers);
  });

  it('should be a function', function () {
    expect(TravelerRepo).to.be.a('function');
  });

  it('should be an instance of TravelersRepo', function () {
    expect(newTravelers).to.be.an.instanceof(TravelerRepo);
  });

  it('should be able to find a user by ID', function () {
    expect(newTravelers.findUser(2)).to.equal(travelers[1]));
  });



});
