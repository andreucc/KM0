'use strict';
const mongoose = require('mongoose');
const User = require('./models/User');

const amigos = [
  {
    username: 'andreu',
    email: 'andreu@io.com',
    password: 'sadfadsfasdf',
    phone: 'asdfasdfasdfa',
    timeTable: ['Mon-Fri 8:00 - 12:00', 'Sat 10:00 - 13:00 & 17:00 - 19:00'],
    location: [39.990045, 3.852401]
  },
  {
    username: 'xavi',
    email: 'xavi@io.com',
    password: 'sadfadsfasdf',
    phone: 'asdfasdfasdfa',
    timeTable: ['Mon-Fri 8:00 - 12:00', 'Sat 10:00 - 13:00 & 17:00 - 19:00'],
    location: [39.990045, 3.852401]
  },
  {
    username: 'lucas',
    email: 'xavi@io.com',
    password: 'sadfadsfasdf',
    phone: 'asdfasdfasdfa',
    timeTable: ['Mon-Fri 8:00 - 12:00', 'Sat 10:00 - 13:00 & 17:00 - 19:00'],
    location: [39.990045, 3.852401]
  },
  {
    username: 'Irene',
    email: 'irene@io.com',
    password: 'sadfadsfasdf',
    phone: 'asdfasdfasdfa',
    timeTable: ['Mon-Fri 8:00 - 12:00', 'Sat 10:00 - 13:00 & 17:00 - 19:00'],
    location: [39.990045, 3.852401]
  }

];

mongoose.connect('mongodb://localhost/km0', {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

User.insertMany(amigos)
  .then(result => console.log(result))
  .catch(err => console.error(err));

// module.exports = User;
