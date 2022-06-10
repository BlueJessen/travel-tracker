
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
    console.log(data);
  }).catch(error => console.log(error));
});

//Data Functions =====================================
// const assignData = () => {
//   allData.then(data => {
//     console.log(allData);
//   }).catch(error => console.log(error));
// }
