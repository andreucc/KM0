'use strict';
const { requireUser } = require('../middlewares/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const express = require('express');
const router = express.Router();
const parser = require('../helpers/file-upload');

router.get('/', parser.single('image'), async (req, res, next) => {
  try {
    if (req.session.currentUser) {
      let id = req.session.currentUser._id;
      const products = await Product.find({ owner: { $ne: id } });
      res.render('index', { products });
    }
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    next(error);
  }
});

// PERFIL

router.get('/profile', requireUser, parser.single('image'), async (req, res, next) => {
  const id = req.session.currentUser._id;
  try {
    const user = await User.findById(id);
    if (user.image === null) {

    }
    res.render('profile', user);
  } catch (error) {
    next(error);
  }
});

router.post('/profile/edit', requireUser, parser.single('image'), async (req, res, next) => {
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
  console.log(req.file.secure_url);
  if (req.file) {
    user.image = req.file.secure_url;
  }
  const id = req.session.currentUser._id;
  try {
    await User.findByIdAndUpdate(id, user);

    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});

router.get('/profile/myorders', requireUser, parser.single('image'), async (req, res, next) => {
  const { _id } = req.session.currentUser;
  try {
    const myorders = await Order.find({ buyer: { _id } }).populate('seller').populate('product');
    const mysells = await Order.find({ seller: { _id } }).populate('buyer').populate('product');
    res.render('orders/myorders', { myorders, mysells });
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const seller = await User.findById(id);
    if (seller === undefined) {
      res.status(404);
    }

    const products = await Product.find({ owner: id });
    if (seller.image === undefined) {
      seller.image = '../images/user.png';
    }
    res.render('outprofile', { seller, products });
    console.log(products);
  } catch (error) {
    next(error);
  }
});

// ---- PRODUCTES

router.get('/product', requireUser, async (req, res, next) => {
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

router.post('/product/create', requireUser, parser.single('image'), async (req, res, next) => {
  const { name, description, amount, units, price } = req.body;
  const product = { name,
    description,
    amount,
    units,
    price
  };
  if (req.file) {
    product.image = req.file.url;
  }
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
    if (producte === undefined) {
      res.status(404);
    }
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

/* cal parser.single()??? */
router.get('/product/:id/edit', requireUser, parser.single('image'), async (req, res, next) => {
  const { id } = req.params;
  try {
    const producte = await Product.findById(id);
    if (producte === undefined) {
      res.status(404);
    }
    res.render('products/edit', { producte });
  } catch (error) {
    next(error);
  }
});

router.post('/product/:id/edit', requireUser, parser.single('image'), async (req, res, next) => {
  const { id } = req.params;
  const { name, description, amount, price, units } = req.body;
  const product = {
    name,
    description,
    amount,
    price,
    units
  };
  if (req.file) {
    product.image = req.file.url;
  }
  try {
    await Product.findByIdAndUpdate(id, product);
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

/* Proteccion contra 404 */

router.get('/profile/auth/logout', (req, res) => {
  delete req.session.currentUser;
  res.redirect('/');
});

router.get('/product/auth/logout', (req, res) => {
  delete req.session.currentUser;
  res.redirect('/');
});
module.exports = router;
