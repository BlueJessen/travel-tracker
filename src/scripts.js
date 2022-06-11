
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
let totalThisYear = document.querySelector('.total-amount');
let topNav = document.querySelector('.top-nav');

//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
let date = '2022/05/11';

//Event Listeners ================================
window.addEventListener('load', () => {
  allData.then(data => {
    let trips = data[0].trips;
    let destinations = data[1].destinations;
    let travelers = data[2].travelers;
    setInitialData(trips, travelers);
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
});

//Data Functions =====================================
const setInitialData = (trips, travelers) => {
  setUpTravelerRepo(travelers);
  findUsersTrips(currentUser.id, setUpTripsRepo(trips));
  console.log(currentUser);
  console.log(usersTrips);
}

const setUpInitialDisplay = (destinations) => {
  console.log(destinations);
  let repo = setUpDestinationsRepo(destinations);
  setTripDestinations(repo);
  getUpcomingTrips();
  getPastTrips();
  getPendingTrips();
  calculateTravelCostThisYear();
  welcomeUser();
}

const setTripDestinations = (repo) => {
  usersTrips.forEach((trip) => {
  let tripDestination = repo.findDestination(trip.destination);
  trip.destination = tripDestination;
});
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
  getRandomUser(travelerRepo);
  return travelerRepo;
}

const setUpTripsRepo = (trips) => {
  return new TripRepo(trips);
}

const findUsersTrips = (userID, trips) => {
  usersTrips = trips.findAllTripsByUser(userID);
  let newTrips = usersTrips.map((trip) => {
    return new Trip(trip);
  });
  usersTrips = newTrips;
}

const setUpDestinationsRepo = (destinations) => {
  let destinationsArray = destinations.map((destination) => {
    return new Destination(destination);
  })
  return new DestinationRepo(destinationsArray);
}

const calculateTravelCostThisYear = () => {
  let sum = 0;
  usersTrips.forEach((trip) => {
    if(trip.date.includes('2022')) {
      let lodging = ((trip.travelers)*(trip.destination.lodgingCost))*trip.duration;
      let flights = (trip.travelers*trip.destination.flightCost)*2;
      sum += (lodging+flights)+((lodging+flights)*.10);
    }
  })
  showTotalCost(sum);
}

//DOM functions ==============================

const welcomeUser = () => {
  topNav.innerText = `  Welcome ${currentUser.name}!`;
}
const showTotalCost = (sum) => {
  totalThisYear.innerText = `$ ${sum}.00`;
}

const getUpcomingTrips = () => {
  usersTrips.forEach((trip) => {
    if(trip.date > date) {
      console.log(trip.destination.name);
      upcomingTrips.innerHTML += `<div class= 'upcoming-trip-card'>
        <img class='upcoming-trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 class='trip-name'>${trip.destination.name}</h1>
        <h2 class='trip-date'>${trip.date}</h2>
      </div>`;
    }
  });
}

const getPastTrips = () => {
  usersTrips.forEach((trip) => {
    if(trip.date < date) {
      pastTrips.innerHTML += `<div class= 'trip-card'>
        <img class='trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 class='trip-name'>${trip.destination.name}</h1>
        <h2 class='trip-date'>${trip.date}</h2>
      </div>`;
    }
  })
}

const getPendingTrips = () => {
  usersTrips.forEach((trip) => {
    if(trip.status === 'pending') {
      pendingTrips.innerHTML += `<div class= 'trip-card'>
        <img class='trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 class='trip-name'>${trip.destination.name}</h1>
        <h2 class='trip-date'>${trip.date}</h2>
      </div>`;
    }
  })
}
