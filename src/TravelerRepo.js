class TravelerRepo {
  constructor(travelerArray) {
    this.travelers = travelerArray;
  }

  findUser(id) {
    return this.travelers.find(traveler => traveler.id === id);
  }
}

export default TravelerRepo;
