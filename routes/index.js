'use strict';
const { requireUser } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    res.render('index');
    // console.log(req.session.currentUser);
  } catch (error) {
    next(error);
  }
});

router.get('/profile', requireUser, async (req, res, next) => {
  const id = req.session.currentUser._id;
  // console.log(id);
  try {
    const user = await User.findById(id);
    // console.log(user);
    res.render('profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/edit', requireUser, async (req, res, next) => {
  const { _id, username, email, timeTable, phone, latitude, longitude } = req.body;
  const user = { username, email, timeTable, phone, latitude, longitude };
  try {
    await User.findByIdAndUpdate(_id, user);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

// ---- PRODUCTES

router.get('/product', requireUser, async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const products = await Product.find();
    res.render('products/list', products);
  } catch (error) {
    next(error);
  }
});

router.get('/product/create', requireUser, (req, res, next) => {
  res.render('products/create');
});

router.post('/product/create', requireUser, async (req, res, next) => {
  const { name, description, amount, units } = req.body;
  const product = { name,
    description,
    amount,
    units
  };
  console.log(product);
  try {
    product.owner = req.session.currentUser._id;
    await Product.create(product);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
