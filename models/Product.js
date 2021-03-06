'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  units: {
    type: String,
    enum: ['Kg', 'Units']
  },
  owner: {
    type: ObjectId,
    ref: 'User'
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
