'use strict';

const updateLocation = () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(hasLocation, error);
  }

  function hasLocation (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const latitudeInputElement = document.getElementById('latitude');
    const longitudeInputElement = document.getElementById('longitude');

    latitudeInputElement.value = latitude;
    longitudeInputElement.value = longitude;

    const submitButtonElement = document.querySelector('form.js-update-user button');
    submitButtonElement.removeAttribute('disabled');
  }

  function error (error) {
    console.log(`There was an error: ${error}`);
  }
};

document.querySelector('#myBtn').addEventListener('click', updateLocation);
