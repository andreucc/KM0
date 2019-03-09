'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema({

  name: {
    type: String,
    // enum: ['tomate', 'berengena', 'calabacin','calabaza', 'lechuga']
    required: true
  },
  description: {
    type: String,
    required: true
  },
  /* image: {
    type: String,
    required: false
  }, */
  amount: {
    type: String,
    required: true
  },
  units: {
    type: String,
    enum: ['Kg', 'Units'],
    required: true
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
