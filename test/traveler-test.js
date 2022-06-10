import chai from 'chai';
const expect = chai.expect;
import { destinations, trips, travelers } from './test-data.js';
import Traveler from '../src/Traveler.js';

describe('Traveler', () => {
  let traveler = null;

  beforeEach( () => {
    traveler = new Traveler(travelers[4]);
  });

  it('should be a function', function () {
    expect(Traveler).to.be.a('function');
  });

  it('should be an instance of Traveler', function () {
    expect(traveler).to.be.an.instanceof(Traveler);
  });

  it('should have an id', function () {
    expect(traveler.id).to.equal(5);
  });

  it('should have a name', function () {
    expect(traveler.name).to.equal('Tiffy Grout');
  });

  it('should have a traveler type', function () {
    expect(traveler.travelerType).to.equal('thrill-seeker');
  });

});
