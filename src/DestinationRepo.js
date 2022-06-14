class DestinationRepo {
  constructor(destinationArray) {
    this.destinations = destinationArray;
  }

  findDestination(id) {
    return this.destinations.find(destination => destination.id === id);
  }

}

export default DestinationRepo
