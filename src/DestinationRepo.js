class DestinationRepo {
  constructor(destinationArray) {
    this.destinations = destinationArray;
  }

  findDestination(id) {
    return this.destinations.find(destination => destination.id === id);
  }

  findDestinationByName(name) {
    return this.destinations.find(destination => destination.name === name);
  }
}

export default DestinationRepo
