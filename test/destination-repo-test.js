import chai from 'chai';
const expect = chai.expect;
import { destinations } from './test-data.js';
import DestinationRepo from '../src/DestinationRepo.js'
import Destination from '../src/Destination.js'

describe('Destinations', () => {
  let destinationRepo = null;

  beforeEach( () => {
    destinationRepo = new DestinationRepo(destinations);
  });

  it('should be a function', function () {
    expect(DestinationRepo).to.be.a('function');
  });

  it('should be an instance of Destinations', function () {
    expect(destinationRepo).to.be.an.instanceof(DestinationRepo);
  });

  it("should have destinations", function () {
    expect(destinationRepo.destinations).to.deep.equal(destinations);
  });

  it("should be able to find a destination using its ID", function () {
    expect(destinationRepo.findDestination(3)).to.equal(destinations[2]);
  });
});
