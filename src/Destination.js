class Destination {
constructor(info) {
  this.id = info.id;
  this.name = info.destination;
  this.imageUrl = info.image;
  this.altText = info.alt;
  this.flightCost = info.estimatedFlightCostPerPerson;
  this.lodgingCost = info.estimatedLodgingCostPerDay;
}
}

export default Destination;
