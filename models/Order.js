'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema({

  seller: {
    type: ObjectId,
    ref: 'User'
  },
  buyer: {
    type: ObjectId,
    ref: 'User'
  },
  product: {
    type: ObjectId,
    ref: 'Product'
  },
  amount: {
    type: Number,
    require: true
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
