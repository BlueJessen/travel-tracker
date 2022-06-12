const getPromise = (dataType) => {
  return fetch(`http://localhost:3001/api/v1/${dataType}`).then(response => response.json())
}

  //populate all databases
const allData = () => {
  return Promise.all([getPromise('trips'), getPromise('destinations'), getPromise('travelers')]);
}

const postUserCall = (postObject, dataType) => {
  return fetch(`http://localhost:3001/api/v1/${dataType}`, {
    method: 'POST',
    body: JSON.stringify(postObject),
    headers: {
    	'Content-Type': 'application/json'
    }
  })
  .then(response => checkForError(response))
  .then(response => {
  response.json()
})
  .catch(error => error)
};

const checkForError = (response) => {
  if (response.ok) {
    return response
  } else {
    throw new Error(response.status)
  }
}

export {
  getPromise,
  postUserCall,
  allData
}
