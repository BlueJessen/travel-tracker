class Trips {
  constructor(tripsArray) {
    this.trips = tripsArray;
  }

  findTrip(id) {
    return this.trips.find(trip => trip.id === id);
  }

  findAllTripsByUser(id) {
    
  }


}

export default Trips;
