'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false,
    default: 'anon@anon.onion'
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false,
    default: '696-969-696'
  },
  timeTable: {
    type: String,
    require: false,
    default: 'laborals 18:20'
  } /*
  location: {
    type: {
      type: String,
      default: '0000, 0000'
    },
    coordinates: [Number]
  } */
});

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
