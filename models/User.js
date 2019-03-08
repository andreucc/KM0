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
    required: false
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  timeTable: {
    type: String,
    require: false
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  }
});

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
