
import './css/styles.css';
import Traveler from './Traveler.js';
import TravelerRepo from './TravelerRepo.js'
import dayjs from 'dayjs';
import Destination from './Destination.js'
import DestinationRepo from './DestinationRepo.js'
import TripRepo from './TripRepo.js';
import Trip from './Trip.js';
import { getPromise, allData, postUserCall } from './apiCalls';

//Query selectors ================================
let upcomingTrips = document.querySelector('.upcoming-trips-container');
let pastTrips = document.querySelector('.past-trips-container');
let pendingTrips = document.querySelector('.pending-trips-container');
let presentTrip = document.querySelector('.present-trip-container');
let presentTripContainer = document.querySelector('.present-trip');
let totalThisYear = document.querySelector('.total-amount');
let topNav = document.querySelector('.top-nav');
let upcomingModuls = document.querySelector('.upcoming-moduls');
let allMain = document.querySelector('main');
let destinationModal = document.querySelector('.destination-modal');
let closeDestinationModal = document.querySelector('.close-destination-button');
//Form Query selectors

let closeButton = document.querySelector(".close-button");
let formModal = document.querySelector(".form-modal");
let newTripForm = document.querySelector('.new-trip');
let tripDuration = document.getElementById('duration');
let travelerAmount = document.getElementById('travelers');
let tripDate = document.getElementById('date');
let newTripButton = document.querySelector('.create-new-trip');
let destinationOptions = document.getElementById('destination-selection');
let cost = document.querySelector('.cost');
let agentFee = document.querySelector('.agent-fee');
let submitTripForm = document.querySelector('.book-new-trip');

//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
let destinations = null;
let trips = null;



//Event Listeners ================================
closeButton.addEventListener("click", toggleModal);
newTripButton.addEventListener('click', showForm);
newTripForm.addEventListener('keyup', showEstimate);
submitTripForm.addEventListener('click', submitForm);
submitTripForm.addEventListener('keyPress', submitForm);
allMain.addEventListener('click', getEvent);
closeDestinationModal.addEventListener('click', getEvent);

window.addEventListener('load', () => {
  allData().then(data => {
    trips = data[0].trips;
    destinations = data[1].destinations;
    let travelers = data[2].travelers;
    setInitialData(trips, travelers);
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
});

//Data Functions =====================================

function getEvent() {
  if(event.target.classList.contains('trip')) {
    showDestinationModal(event.target);
  }else if(event.target.classList.contains('close-destination-button')) {
    toggleDestinationModal();
  }
}

function showForm() {
  populateSelections();
  toggleModal();
}

function showEstimate() {
  let duration = tripDuration.value;
  let travelers = travelerAmount.value;
  let destination = destinationOptions.value;
  let infoD = destinations.findDestination(parseInt(destination));
let sum = (duration*infoD.lodgingCost*travelers)+(travelers*infoD.flightCost);
  cost.innerText = `Estimated Cost: $${sum}`;
  agentFee.innerText = `Agent Fee: $${sum*.10}`;

}

const populateSelections = () => {
  destinations.destinations.forEach((destination) => {
    destinationOptions.innerHTML += `<option id=${destination.id} value="${destination.id}">${destination.name}</option>`;
  });
}

const setInitialData = (trips, travelers) => {
  setUpTravelerRepo(travelers);
  findUsersTrips(currentUser.id, setUpTripsRepo(trips));
}

const resetData = (trips, travelers) => {
  findUsersTrips(currentUser.id, setUpTripsRepo(trips));
}

const setUpInitialDisplay = () => {
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
  let tripDestination = destinations.findDestination(trip.destinationID);
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
let tripsRepo = new TripRepo(trips);
trips = tripsRepo;
return tripsRepo;
}

const findUsersTrips = (userID, trips) => {
  usersTrips = trips.findAllTripsByUser(userID);
  let newTrips = [];
  usersTrips.forEach((trip) => {
    let newTrip = new Trip(trip);
    newTrips.push(newTrip);
  });
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
    if(dayjs(trip.date).year() === dayjs().year()) {
      let lodging = ((trip.travelers)*(trip.destination.lodgingCost))*trip.duration;
      let flights = (trip.travelers*trip.destination.flightCost);
      sum += (lodging+flights)+((lodging+flights)*.10);
    }
  })
  showTotalCost(sum);
}

function submitForm() {
  event.preventDefault();
  console.log(trips);
  let tripObj = {id: trips.length+1, userID:currentUser.id,
    destinationID: parseInt(destinationOptions.value),
    travelers: travelerAmount.value,
    date:(tripDate.value).split('-').join('/'),
    duration:parseInt(tripDuration.value),
    status:"pending",
    suggestedActivities:[]};
    console.log(tripObj);
  postUserCall(tripObj,'trips').then(response => reloadData());
  toggleModal();
}

function reloadData() {
  allData().then(data => {
    let trips = data[0].trips;
    destinations = data[1].destinations;
    let travelers = data[2].travelers;
    resetData(trips, travelers);
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
}

//DOM functions ==============================

function toggleModal() {
  formModal.classList.toggle('show-modal')
}

const welcomeUser = () => {
  topNav.innerText = `  Welcome ${currentUser.name}!`;
}
const showTotalCost = (sum) => {
  totalThisYear.innerText = `$ ${sum}.00`;
}

const showDestinationModal = (destination) => {
let cardInfo = destinations.findDestination(parseInt(destination.id));
  destinationModal.innerHTML = `
    <span class="close-destination-button">X</span>
    <div class='modal-content destination-modal'>
      <div>
        <img class='large-destination-image' src=${cardInfo.imageUrl} alt=${cardInfo.altText} ></img>
        <h1 class='destination-name'>${cardInfo.name}</h1>
        <p class='destination-details'>Flight Cost Estimate Per Person: $${cardInfo.flightCost}</p>
        <p class= 'destination-details'>Lodging Cost Per Day: $${cardInfo.lodgingCost}</p>
        <button class='book-trip-with-location-button'>Book A Flight</button>
      </div>
    </div>`;
 toggleDestinationModal();
}

function toggleDestinationModal () {
      destinationModal.classList.toggle('show-modal');

}

const getPresentTrips = () => {
  usersTrips.forEach((trip) => {
    if(dayjs(trip.date) <= dayjs() && dayjs() < dayjs(trip.date).add(trip.duration, 'day')) {
      presentTripContainer.classList.remove('hidden');
      presentTrip.innerHTML += `  <div class= 'trip trip-card' id=${trip.destination.id}>
          <img class='trip upcoming-trip-card-img' id=${trip.destination.id} src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
          <h1 id=${trip.destination.id} class='trip trip-name'>${trip.destination.name}</h1>
          <h2 id=${trip.destination.id} class='trip trip-date'>${trip.date}</h2>
        </div>`;
    }
  })
}

const getUpcomingTrips = () => {
  usersTrips.forEach((trip) => {
    if(dayjs(trip.date) > dayjs() && trip.status !== 'pending') {
      upcomingTrips.innerHTML += `
      <div class= 'trip upcoming-trip-card'id=${trip.destination.id}>
        <img id=${trip.destination.id} class='trip upcoming-trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 id=${trip.destination.id} class='trip trip-name'>${trip.destination.name}</h1>
        <h2 id=${trip.destination.id} class='trip trip-date'>${trip.date}</h2>
      </div>`;
    }
  });
}

const getPastTrips = () => {
  usersTrips.forEach((trip) => {
    if(dayjs(trip.date) < dayjs()) {
      pastTrips.innerHTML += `<div id=${trip.destination.id} class= 'trip trip-card'>
        <img id=${trip.destination.id} class='trip trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 id=${trip.destination.id} class='trip trip-name'>${trip.destination.name}</h1>
        <h2 id=${trip.destination.id} class='trip trip-date'>${trip.date}</h2>
      </div>`;
    }
  });
}

const getPendingTrips = () => {
  usersTrips.forEach((trip) => {
    if(trip.status === 'pending' && dayjs(trip.date) > dayjs()) {
      pendingTrips.innerHTML += `<div id=${trip.destination.id} class= 'trip trip-card'>
        <img id=${trip.destination.id} class='trip trip-card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 id=${trip.destination.id} class='trip trip-name'>${trip.destination.name}</h1>
        <h2 id=${trip.destination.id} class='trip trip-date'>${trip.date}</h2>
      </div>`;
    }
  })
}
