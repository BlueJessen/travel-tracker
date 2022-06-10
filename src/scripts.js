
import './css/styles.css';
import Traveler from './Traveler.js';
import TravelerRepo from './TravelerRepo.js'
import Destination from './Destination.js'
import DestinationRepo from './DestinationRepo.js'
import Trips from './Trips.js';
import { getPromise, allData } from './apiCalls';

//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
//Event Listeners ================================
window.addEventListener('load', () => {
  allData.then(data => {
    let trips = data[0];
    let destinations = data[1];
    let travelers = data[2];
  }).catch(error => console.log(error));
});

//Data Functions =====================================
const setUpTravelerRepo = (travelersArray) => {
  let travelers = travelersArray.map((traveler) => {
    return new Traveler(traveler);
  })
  let travelerRepo = new TravelerRepo(travelers);
  getRandomUser(travelerRepo)
  return travelerRepo
}

const getRandomUser = (travelers) => {
  let randomIndex = Math.floor(Math.random() * travelers.travelers.length)
  currentUser = travelers.travelers[randomIndex];
}

const setUpTripsRepo = (trips) => {
  return new Trips(trips);
}

const findUsersTrips = (userID, trips) => {
  usersTrips = trips.findAllTripsByUser(userID);
}
