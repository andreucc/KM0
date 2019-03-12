'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');
const saltRounds = 10;

// SIGNUP
router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;
  // cordenades per defecte
  let latitude = -8.362770;
  let longitude = 70.993038;
  try {
    // Comprovar que no hi ha cap usuari registrat amb el mateix username
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation');
      res.redirect('/auth/signup');
      return;
    }
    // Encriptar password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Crear usuari
    const newUser = {
      username,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    };
    const createdUser = await User.create(newUser);
    req.session.currentUser = createdUser;
    // redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// LOGIN

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // comparar usuari
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'This username is not registered');
      res.redirect('/auth/login');
      return;
    }
    // comparar contrasenya
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// LOGOUT

router.get('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
