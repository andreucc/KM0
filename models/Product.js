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
  amount: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
