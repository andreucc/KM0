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
    required: true
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
      default: '0000, 0000'
    },
    coordinates: [Number],
    require: false
  }
});

UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

module.exports = User;
