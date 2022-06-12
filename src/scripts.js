
import './css/styles.css';
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
let presentTrip = document.querySelector('.present-trip-container');
let presentTripContainer = document.querySelector('.trip-container');
let totalThisYear = document.querySelector('.total-amount');
let topNav = document.querySelector('.top-nav');
let upcomingModuls = document.querySelector('.upcoming-moduls');
//Form Query selectors

let closeButton = document.querySelector(".close-button");
let formModal = document.querySelector(".modal");
let newTripForm = document.querySelector('.new-trip');
let tripDuration = document.getElementById('duration');
let travelerAmount = document.getElementById('travelers');
let tripDate = document.getElementById('date');
let newTripButton = document.querySelector('.create-new-trip');
let destinationOptions = document.getElementById('destination-selection');
let cost = document.querySelector('.cost');
let agentFee = document.querySelector('.agent-fee');

//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
let date = new Date();
let destinations = null;



//Event Listeners ================================
closeButton.addEventListener("click", toggleModal);
newTripButton.addEventListener('click', showForm);
newTripForm.addEventListener('keyup', showEstimate);

window.addEventListener('load', () => {
  allData.then(data => {
    let trips = data[0].trips;
    destinations = data[1].destinations;
    let travelers = data[2].travelers;
    setInitialData(trips, travelers);
    formatDate();
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
});

//Data Functions =====================================
function showForm() {
  populateSelections();
  toggleModal();
}

function showEstimate() {
  let duration = tripDuration.value;
  let travelers = travelerAmount.value;
  let destination = destinationOptions.value;
  let infoD = destinations.findDestinationByName(destination);
let sum = (duration*infoD.lodgingCost*travelers)+(travelers*infoD.flightCost);
  cost.innerText = `Estimated Cost: $${sum}`;
  agentFee.innerText = `Agent Fee: $${sum*.10}`;

}

const populateSelections = () => {
  destinations.destinations.forEach((destination) => {
    destinationOptions.innerHTML += `<option id=${destination.id} value="${destination.name}">${destination.name}</option>`;
  });
}

const formatDate = () => {
  let today = '';
  let month = date.getMonth();
  if(month < 10) {
    month = `0${month}`;
  }
  today += `20${date.getFullYear()}/${month}/${date.getDate()}`;
  date = today;
}

const setInitialData = (trips, travelers) => {
  setUpTravelerRepo(travelers);
  findUsersTrips(currentUser.id, setUpTripsRepo(trips));
  console.log(currentUser);
  console.log(usersTrips);
}

const setUpInitialDisplay = () => {
  console.log(destinations);
  setUpDestinationsRepo();
  setTripDestinations();
  getUpcomingTrips();
  getPresentTrips();
  getPastTrips();
  getPendingTrips();
  calculateTravelCostThisYear();
  welcomeUser();
}

const setTripDestinations = () => {
  usersTrips.forEach((trip) => {
  let tripDestination = destinations.findDestination(trip.destination);
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

const setUpDestinationsRepo = () => {
  let destinationsArray = destinations.map((destination) => {
    return new Destination(destination);
  });
  destinations = new DestinationRepo(destinationsArray);
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
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function toggleModal() {
  formModal.classList.toggle('show-modal')
}

const welcomeUser = () => {
  topNav.innerText = `  Welcome ${currentUser.name}!`;
}
const showTotalCost = (sum) => {
  totalThisYear.innerText = `$ ${sum}.00`;
}

const getPresentTrips = () => {
  let days = [];
let thisYear = usersTrips.filter((trip) => {
    let newDate = new Date(trip.date);
    let today = new Date();
    if(newDate.getFullYear() === today.getFullYear()){
      return trip;
    }
  });
  if(thisYear.includes(date)) {
    displayPresentTrip(thisYear);
  }
}

const displayPresentTrip = (yearArray) => {
  presentTripContainer.classList.remove('hidden');
  yearArray.forEach((trip) => {
    if(trip.date === date) {
      presentTrip.innerHTML += `  <div class= 'trip-card'>
          <img class='upcoming-trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
          <h1 class='trip-name'>${trip.destination.name}</h1>
          <h2 class='trip-date'>${trip.date}</h2>
        </div>`;
    }
  })
}

const getUpcomingTrips = () => {
  usersTrips.forEach((trip) => {
    if(trip.date > date) {
      console.log(trip.destination.name);
      upcomingTrips.innerHTML += `
      <div class= 'upcoming-trip-card'>
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
  });
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
