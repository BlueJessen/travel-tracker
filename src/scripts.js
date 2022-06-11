
import './css/styles.css';
import './images/turing-logo.png';
import Traveler from './Traveler.js';
import TravelerRepo from './TravelerRepo.js'
import Destination from './Destination.js'
import DestinationRepo from './DestinationRepo.js'
import TripRepo from './TripRepo.js';
import Trip from './Trip.js';
import { getPromise, allData } from './apiCalls';

//Query selectors ================================
let upcomingTrips = document.querySelector('.upcoming-trips-container');
let pastTrips = document.querySelector('.past-trips-container');
let pendingTrips = document.querySelector('.pending-trips-container');
let totalThisYear = document.querySelector('.total-amount-container');
let topNav = document.querySelector('.top-nav');


//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
//Event Listeners ================================
window.addEventListener('load', () => {
  allData.then(data => {
    let trips = data[0].trips;
    let destinations = data[1].destinations;
    let travelers = data[2].travelers;
    setInitialData(trips, destinations, travelers);
  }).catch(error => console.log(error));
});

//Data Functions =====================================
const setInitialData = (trips, destinations, travelers) => {
  setUpTravelerRepo(travelers);
  findUsersTrips(currentUser.id, setUpTripsRepo(trips));
  console.log(currentUser);
  console.log(usersTrips);
}

const getRandomUser = (travelers) => {
  let randomIndex = Math.floor(Math.random() * travelers.travelers.length)
  currentUser = travelers.travelers[randomIndex];
}

const setUpTravelerRepo = (travelersArray) => {
  let travelers = travelersArray.map((traveler) => {
    return new Traveler(traveler);
  })
  let travelerRepo = new TravelerRepo(travelers);
  getRandomUser(travelerRepo)
  return travelerRepo
}

const setUpTripsRepo = (trips) => {
  return new TripRepo(trips);
}

const findUsersTrips = (userID, trips) => {
  usersTrips = trips.findAllTripsByUser(userID);
}

const setUpDestinationsRepo = (destinations) => {
  let destinationsArray = destinations.map((destination) => {
    return new Destination(destination);
  })
  let destinationRepo = new DestinationRepo(destinationsArray);
}

//DOM functions ==============================
