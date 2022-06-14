
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
let allBody = document.querySelector('body');
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

//login selectors
let username = document.getElementById('username');
let password = document.getElementById('password');
let loginButton = document.querySelector('.login-button');
let loginModal = document.querySelector('.login-modal');
let errorMessage = document.querySelector('.error-message');

//Global Variables ===============================
let currentUser = null;
let usersTrips = null;
let destinations = null;
let trips = null;




//Data Functions =====================================
const fetchLoginData = (userID) => {
    event.preventDefault();
    toggleLoginModal();
  let user = getPromise(`travelers/${userID}`);
  user.then(data => {
    if (data.message === `No traveler found with an id of ${userID}`) {
      return failedToFetch()
    }
    currentUser = data;
  }).catch(error => failedToFetch())
  allData().then(data => {
    trips = data[0].trips;
    destinations = data[1].destinations;
    let travelers = data[2].travelers;
    setInitialData(trips, travelers);
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
}

const attemptLogin = () => {
  if(password.value === 'travel') {
    let userID = parseInt(username.value.split('traveler')[1]);
    fetchLoginData(userID)
  } else {
    alertOfIncorrectPassword();
  }
}

const failedToFetch = () => {
  username.value = '';
  password.value = '';
  errorMessage.innerText = `Server error please try again or user different username`;
  toggleLoginModal()
}

const alertOfIncorrectPassword = () => {
  password.value = '';
  errorMessage.innerText = `username or password is incorrect`;
}

const toggleLoginModal = () => {
  loginModal.classList.toggle('show-modal');
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
  usersTrips.trips.forEach((trip) => {
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
  })
  usersTrips = new TripRepo(newTrips);
}

const setUpDestinationsRepo = () => {
  let destinationsArray = destinations.map((destination) => {
    return new Destination(destination);
  });
  destinations = new DestinationRepo(destinationsArray);
}

const calculateTravelCostThisYear = () => {
  let sum = 0;
  usersTrips.trips.forEach((trip) => {
    if(dayjs(trip.date).year() === dayjs().year()) {
      let lodging = ((trip.travelers)*(trip.destination.lodgingCost))*trip.duration;
      let flights = (trip.travelers*trip.destination.flightCost);
      sum += (lodging+flights)+((lodging+flights)*.10);
    }
  })
  showTotalCost(sum);
}

const submitForm = () => {
  event.preventDefault();
  let tripObj = {id: trips.length+1, userID:currentUser.id,
    destinationID: parseInt(destinationOptions.value),
    travelers: travelerAmount.value,
    date:(tripDate.value).split('-').join('/'),
    duration:parseInt(tripDuration.value),
    status:"pending",
    suggestedActivities:[]};
  postUserCall(tripObj,'trips').then(response => reloadData());
  toggleModal();
}

const reloadData = () => {
  allData().then(data => {
    let trips = data[0].trips;
    destinations = data[1].destinations;
    let travelers = data[2].travelers;
    resetData(trips, travelers);
    setUpInitialDisplay(destinations)
  }).catch(error => console.log(error));
}

//DOM functions ==============================

const getKey = () => {
  if(event.code === 'Enter') {
    getEvent(event)
  }
}
function getEvent(event) {
  if(event.target.classList.contains('trip')) {
    showDestinationModal(event.target);
  }else if(event.target.classList.contains('close-destination-button')) {
    toggleDestinationModal();
  }
}

const showForm = () => {
  populateSelections();
  toggleModal();
}

const showEstimate = () => {
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

const toggleModal = () => {
  formModal.classList.toggle('show-modal')
}

const welcomeUser = () => {
  topNav.innerText = `  Welcome ${currentUser.name}!`;
}
const showTotalCost = (sum) => {
  totalThisYear.innerText = `$ ${sum}.00`;
}

const getModalText = (destination, thisTrip) => {
  console.log(destination.classList)
  if(destination.classList.contains('past')){
    return `Your ${thisTrip.date} trip with ${thisTrip.travelers} was ${thisTrip.duration} days!`;
  }else if(destination.classList.contains('upcoming')) {
      return `Your ${thisTrip.date} trip with ${thisTrip.travelers} will be ${thisTrip.duration} days!`
  }else if(destination.classList.contains('pending')){
      return `Your ${thisTrip.date} trip with ${thisTrip.travelers} is pending!`
  }else if(destination.classList.contains('present')){
      return `Your ${thisTrip.date} trip with ${thisTrip.travelers} is ${thisTrip.duration} days!`
  }
}

const showDestinationModal = (destination) => {
  let tripID = parseInt((destination.closest('.trip-card').id).split(',')[1]);
  let thisTrip = usersTrips.findTrip(tripID);
let cardInfo = destinations.findDestination( parseInt((destination.closest('.trip-card').id).split(',')[0]));
  let cardText = getModalText(destination, thisTrip);
  console.log(cardText)
  destinationModal.innerHTML = `
    <span class="close-destination-button">X</span>
    <div class='modal-content destination-modal'>
      <div>
        <img class='large-destination-image' src=${cardInfo.imageUrl} alt=${cardInfo.altText} ></img>
        <h1 class='destination-name'>${cardInfo.name}</h1>
        <h1 class='destination-details'>${cardText}</h1>
        <p class='destination-details'>Flight Cost Estimate Per Person: $${cardInfo.flightCost}</p>
        <p class= 'destination-details'>Lodging Cost Per Day: $${cardInfo.lodgingCost}</p>
      </div>
    </div>`;
 toggleDestinationModal();
}

const toggleDestinationModal = ()  => {
  destinationModal.classList.toggle('show-modal');
}

const getPresentTrips = () => {
  presentTrip.innerHTML = '';
  usersTrips.trips.forEach((trip) => {
    if(dayjs(trip.date) <= dayjs() && dayjs() < dayjs(trip.date).add(trip.duration, 'day')) {
      presentTripContainer.classList.remove('hidden');
      presentTrip.innerHTML += `  <div tabindex='0' class='present trip trip-card' id=${trip.destination.id},${trip.id}>
          <img class='present trip upcoming-trip-card-img' name=${trip.id}  id=${trip.destination.id} src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
          <h1 name=${trip.id} id=${trip.destination.id} class='present trip card-name'>${trip.destination.name}</h1>
          <h2 name=${trip.id} id=${trip.destination.id} class='present trip card-date'>${trip.date}</h2>
        </div>`;
    }
  })
}

const getUpcomingTrips = () => {
    upcomingTrips.innerHTML = '';
  usersTrips.trips.forEach((trip) => {
    if(dayjs(trip.date) > dayjs() && trip.status !== 'pending') {
      upcomingTrips.innerHTML += `
      <div name=${trip.id} tabindex='0' class= 'upcoming trip trip-card upcoming-trip-card'id=${trip.destination.id},${trip.id}>
        <img name=${trip.id} id=${trip.destination.id} class='upcoming trip upcoming-trip-card-img card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 name=${trip.id} id=${trip.destination.id} class='upcoming trip card-name'>${trip.destination.name}</h1>
        <h2 name=${trip.id} id=${trip.destination.id} class='upcoming trip card-date'>${trip.date}</h2>
      </div>`;
    }
  });
}

const getPastTrips = () => {
    pastTrips.innerHTML = '';
  usersTrips.trips.forEach((trip) => {
    if(dayjs(trip.date) < dayjs()) {
      pastTrips.innerHTML += `<div value=${trip.id} tabindex='0' id=${trip.destination.id},${trip.id} class= 'past trip trip-card'>
        <img name=${trip.id} id=${trip.destination.id} class='past trip card-img' src=${trip.destination.imageUrl} alt=${trip.destination.altText}></img>
        <h1 value=${trip.id} id=${trip.destination.id} class='past trip card-name'>${trip.destination.name}</h1>
        <h2 class='past trip card-date'>${trip.date}</h2>
      </div>`;
    }
  });
}

const getPendingTrips = () => {
  pendingTrips.innerHTML = '';
  usersTrips.trips.forEach((trip) => {
    if(trip.status === 'pending' && dayjs(trip.date) > dayjs()) {
      pendingTrips.innerHTML += `<div name=${trip.id}  tabindex='0'id=${trip.destination.id},${trip.id} class= 'pending trip trip-card'>
        <img name=${trip.id} id=${trip.destination.id} class='pending trip card-img' src=${trip.destination.imageUrl} alt=${trip.destination.alt}></img>
        <h1 name=${trip.id} id=${trip.destination.id} class='pending trip card-name'>${trip.destination.name}</h1>
        <h2 name=${trip.id} id=${trip.destination.id} class='pending trip card-date'>${trip.date}</h2>
      </div>`;
    }
  })
}

//Event Listeners ================================
closeButton.addEventListener("click", toggleModal);
newTripButton.addEventListener('click', showForm);
newTripForm.addEventListener('keyup', showEstimate);
submitTripForm.addEventListener('click', submitForm);
submitTripForm.addEventListener('keyPress', submitForm);
allMain.addEventListener('click', getEvent);
allBody.addEventListener('keyup', getKey);
closeDestinationModal.addEventListener('click', getEvent);
loginButton.addEventListener('click', attemptLogin)

window.addEventListener('load', toggleLoginModal)
