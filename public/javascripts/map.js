'use strict';

const main = () => {
  const location = document.getElementById('garden-location').innerHTML;
  const locationArr = location.split(',');
  mapboxgl.accessToken = 'pk.eyJ1IjoibmNvZGVyOTIiLCJhIjoiY2pkbmRmdno4MGQ2ODJ4bWtxcG02dnk1ciJ9.DehQETKEOyrOha4hqclYvg';
  const mapOptions = {
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [locationArr[0], locationArr[1]],
    zoom: 15
  };
  const map = new mapboxgl.Map(mapOptions);

  const marker1 = new mapboxgl.Marker()
    .setLngLat([locationArr[0], locationArr[1]])
    .addTo(map);

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

      mapboxgl.accessToken = 'pk.eyJ1IjoibmNvZGVyOTIiLCJhIjoiY2pkbmRmdno4MGQ2ODJ4bWtxcG02dnk1ciJ9.DehQETKEOyrOha4hqclYvg';
      const mapOptionsUdated = {
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 14
      };
      const map = new mapboxgl.Map(mapOptionsUdated);
      const marker1 = new mapboxgl.Marker({
        draggable: true
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      function onDragEnd () {
        var lngLat = marker1.getLngLat();
        latitudeInputElement.value = lngLat.lat;
        longitudeInputElement.value = lngLat.lng;
      }

      marker1.on('dragend', onDragEnd);
    }
    function error (error) {
      console.log(`There was an error: ${error}`);
    }
  };
  document.querySelector('#myBtn').addEventListener('click', updateLocation);
};

window.addEventListener('load', main);
