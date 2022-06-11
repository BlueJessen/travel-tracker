class TripRepo {
  constructor(tripsArray) {
    this.trips = tripsArray;
  }

  findTrip(id) {
    return this.trips.find(trip => trip.id === id);
  }

  findAllTripsByUser(id) {
    return this.trips.filter(trip => trip.userID === id);
  }

  findTripsOnDate(date) {
      return this.trips.filter(trip => trip.date === date);
  }

}

export default TripRepo;
