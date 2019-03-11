'use strict';

const main = () => {
  document.getElementById('mysells').style.display = 'none';
};
window.addEventListener('load', main);

function show1 () {
  document.getElementById('mysells').style.display = 'none';
  document.getElementById('myorders').style.display = 'block';
}
function show2 () {
  document.getElementById('mysells').style.display = 'block';
  document.getElementById('myorders').style.display = 'none';
}

// Cambiar llamada de funcion del hbs a aqui con addEventListener
