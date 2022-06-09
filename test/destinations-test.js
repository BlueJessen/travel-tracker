import { expect } from 'chai';
import { trips, destinations, travelers} from './test-data.js';

describe('Destinations', () => {
  let destinationRepo = null;

  beforeEach( () => {
    destinationRepo = new Destinations(destinations);
  });

  it('should be a function', function () {
  expect(Destinations).to.be.a('function');
});

it('should be an instance of Destinations', function () {
  expect(destinationRepo).to.be.an.instanceof(Destination);
});

it("should be able to find a destination using its ID", function () {
  expect(destinationRepo.findDestination(3)).to.deep.equal(destinations[4]);
});

)}
