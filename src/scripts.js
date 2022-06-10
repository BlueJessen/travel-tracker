
import './css/styles.css';
import Traveler from './Traveler.js';
import TravelerRepo from './TravelerRepo.js'
import Destination from './Destination.js'
import DestinationRepo from './DestinationRepo.js'
import Trips from './Trips.js';
import { getPromise, allData } from './apiCalls';

//Event Listeners ================================
window.addEventListener('load', () => {
  allData.then(data => {
    let trips = data[0];
    let destinations = data[1];
    let travelers = data[2];
  }).catch(error => console.log(error));
});

//Data Functions =====================================
