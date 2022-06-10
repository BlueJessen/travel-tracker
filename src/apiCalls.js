const getPromise = (dataType) => {
  return fetch(`http://localhost:3001/api/v1/${dataType}`).then(response => response.json())
}

  //populate all databases
let allData = Promise.all([getPromise('trips'), getPromise('destinations'), getPromise('travelers')]);


export {
  getPromise,
  allData
}
