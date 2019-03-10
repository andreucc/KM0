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

router.get('/product', async (req, res, next) => {
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

router.get('/product/:id/buy', requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.session.currentUser;
  try {
    const producte = await Product.findById(id).populate('owner');
    const comprador = await User.findById(_id);
    res.render('products/buy', { producte, comprador });
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
    await Order.create(order);
    // actualitzar stock
    let stockDisponible = await producte.amount - amount;
    console.log(stockDisponible);
    console.log(product);
    // No ho fa be, stockDisponible es correcte pero no actualitza sa bd
    await Product.findByIdAndUpdate(product, { $set: { cantidad: stockDisponible } });
    res.redirect('/profile');
  } catch (error) {
    console.log('prueba' + error);
    next(error);
  }
});
// ---------FALTARA FER SA VISTA I SA RUTA DE SES ORDERS DE S'USUARI---------------------

/*
router.get('/buy', requireUser, async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const buyer = await User.findById(_id);
    res.render('products/buy', { buyer });
  } catch (error) {
    next(error);
  }
});

router.post('/product/buy', requireUser, async (req, res, next) => {
  const { _id } = req.params;
  const { amount } = req.body;
  try {
    const product = await Product.findById(_id).populate('owner');
    Order.seller = product.owner.id;
    Order.buyer = _id;
    Order.amount = amount;
    Order.product = product.id;
    console.log(Order);
    // product.owner = req.session.currentUser._id;
    await Order.create(Order);

    product.amount -= amount;
    console.log(product);
    await Product.findByIdAndUpdate(_id, product);

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});
*/
module.exports = router;
