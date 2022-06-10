
import './css/styles.css';
import Traveler from './Traveler.js';
import TravelerRepo from './TravelerRepo.js'
import Destination from './Destination.js'
import DestinationRepo from './DestinationRepo.js'
import Trips from './Trips.js';
import { getPromise, allData } from './apiCalls';


window.addEventListener('load', assignData);

const assignData = () => {
  allData.then(data => {
    console.log(allData[0]);
  }).catch(error => console.log(error));
}
