'use strict';
const { requireUser } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');

const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});
/* GET home page. */
router.get('/profile', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;

  try {
    const user = await User.findById(_id);
    res.render('profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile', requireUser, async (req, res, next) => {
  const { _id, username, email, timeTable, phone, latitude, longitude } = req.body;
  const user = { username, email, timeTable, phone, latitude, longitude };
  console.log(user);
  try {
    await User.findByIdAndUpdate(_id, user);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/product', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;

  try {
    const user = await User.findById(_id);
    res.render('products/product', user);
  } catch (error) {
    next(error);
  }
});

router.post('/product', requireUser, async (req, res, next) => {
  const { name, description, amount, units } = req.body;
  const product = { name,
    description,
    image: req.file.url,
    amount,
    units };
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
