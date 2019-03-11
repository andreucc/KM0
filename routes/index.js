'use strict';
const { requireUser } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    next(error);
  }
});

// PERFIL

router.get('/profile', requireUser, async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const user = await User.findById(id);
    res.render('profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/edit', requireUser, async (req, res, next) => {
  const { username, email, timeTable, phone, latitude, longitude } = req.body;
  const user = {
    username,
    email,
    timeTable,
    phone,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  };
  const id = req.session.currentUser._id;
  try {
    await User.findByIdAndUpdate(id, user);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/profile/myorders', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const myorders = await Order.find({ buyer: { _id } }).populate('seller').populate('product');
    const mysells = await Order.find({ seller: { _id } }).populate('buyer').populate('product');
    res.render('orders/myorders', { myorders, mysells });
  } catch (error) {
    next(error);
  }
});

// ---- PRODUCTES

router.get('/product', requireUser, async (req, res, next) => {
  /* if (!req.currentUser) {
    res.redirect('/');
  } */
  const id = req.session.currentUser._id;
  try {
    const products = await Product.find({ owner: id });
    res.render('products/list', { products });
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
  try {
    product.owner = req.session.currentUser._id;
    await Product.create(product);
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!req.session.currentUser) {
    const producte = await Product.findById(id).populate('owner');
    res.render('products/detail', { producte });
  }
  const { _id } = req.session.currentUser;
  try {
    const producte = await Product.findById(id).populate('owner');
    let isOwner = false;
    if (producte.owner.equals(_id)) {
      isOwner = true;
    }
    res.render('products/detail', { producte, isOwner });
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id/edit', requireUser, async (req, res, next) => {
  const { id } = req.params;
  try {
    const producte = await Product.findById(id);
    console.log(producte);
    res.render('products/edit', { producte });
  } catch (error) {
    next(error);
  }
});

router.post('/product/:id/edit', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { name, description, amount, units } = req.body;
  const producte = {
    name,
    description,
    amount,
    units
  };
  try {
    await Product.findByIdAndUpdate(id, producte);
    res.redirect('/product');
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id/delete', requireUser, async (req, res, next) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.redirect('/product');
  } catch (error) {
    next(error);
  }
});

router.get('/product/:id/buy', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  const data = {
    messages: req.flash('validation')
  };
  try {
    const producte = await Product.findById(id).populate('owner');
    const comprador = await User.findById(_id);
    res.render('products/buy', { producte, comprador, data });
  } catch (error) {
    next(error);
  }
});

router.post('/product/:id/buy', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  const { amount } = req.body;
  try {
    const producte = await Product.findById(id).populate('owner');
    const product = producte._id;
    const seller = producte.owner._id;
    const buyer = _id;
    const order = {
      seller,
      buyer,
      product,
      amount
    };
    // actualitzar stock
    if (await producte.amount < amount) {
      req.flash('validation', 'OutofStock Select less quantity');
      res.redirect(`/product/${id}/buy`);
    } else {
      await Order.create(order);
      let stockDisponible = await producte.amount - amount;
      await Product.findByIdAndUpdate(product, { $set: { 'amount': stockDisponible } });
      res.redirect('/profile/myorders');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
