class Trip {
  constructor(trip) {
    this.id = trip.id;
    this.userID = trip.userID;
    this.travelers = trip.travelers;
    this.destination = trip.destinationID;
    this.duration = trip.duration;
    this.date = trip.date;
    this.status = trip.status;
    this.suggestedActivities = trip.suggestedActivities;
  }
}

  export default Trip;
