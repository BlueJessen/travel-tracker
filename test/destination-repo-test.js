import { expect } from 'chai';
import {destinations} from './test-data.js';
import DestinationRepo from '../src/DestinationRepo.js'
import Destination from '../src/Destination.js'

describe('Destinations', () => {
  let destinationRepo = null;

  it('should be a function', function () {
    expect(DestinationRepo).to.be.a('function');
  });

  beforeEach( () => {
    destinationRepo = new DestinationRepo(destinations);
  });

  it('should be an instance of Destinations', function () {
    expect(destinationRepo).to.be.an.instanceof(DestinationRepo);
  });

  it("should be able to find a destination using its ID", function () {
    expect(destinationRepo.findDestination(3)).to.deep.equal(destinations[4]);
  });
});
