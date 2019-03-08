'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const OrderSchema = new Schema({

  seller: {
    type: ObjectId
  },
  buyer: {
    type: ObjectId
  },
  product: {
    type: ObjectId
  },
  amount: {
    type: Number,
    require: true
  }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
