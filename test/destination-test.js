import chai from 'chai';
const expect = chai.expect;
import { destinations } from './test-data.js';
import Destination from '../src/Destination.js';

describe('Destination', () => {
  let destination = null;

  beforeEach( () => {
    destination = new Destination(destinations[1]);
  })

  it('should be a function', function () {
  expect(Destination).to.be.a('function');
  });

  it('should be an instance of Destination', function() {
    expect(destination).to.be.an.instanceof(Destination);
  });

  it("should have an ID", function() {
    expect(destination.id).to.equal(destinations[1].id);
  });

  it("should have a name", function() {
    expect(destination.name).to.equal(destinations[1].destination);
  });

  it("should have an image url", function() {
    expect(destination.imageUrl).to.equal(destinations[1].image);
  });

  it("should have an image alt text", function() {
    expect(destination.altText).to.equal(destinations[1].alt);
  });

  it("should have a flight cost", function() {
    expect(destination.flightCost).to.equal(780);
  });

  it("should have lodging cost", function() {
  expect(destination.lodgingCost).to.equal(100);
  });

});
