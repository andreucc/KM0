'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
 
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
    required: true
  },
  timeTable: {
    type: Enum,
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

//tortillaSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);

module.exports = User;

