import chai from 'chai';
const expect = chai.expect;
import { destinations, trips, travelers } from './test-data.js';
import Traveler from '../src/Traveler.js';
import TravelerRepo from '../src/TravelerRepo.js';

describe('TravelerRepo', () => {
  let travelers = null;

  beforeEach( () => {
    travelers = new TravelerRepo(travelers);
  });

  it('should be a function', function () {
    expect(TravelerRepo).to.be.a('function');
  });

  it('should be an instance of TravelersRepo', function () {
    expect(travelers).to.be.an.instanceof(TravelerRepo);
  });


});
