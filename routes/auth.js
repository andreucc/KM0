'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const User = require('../models/User');

const { requireAnon, requireUser, requireFields } = require('../middlewares/auth');

const saltRounds = 10;

router.get('/signup', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/signup', data);
});

router.post('/signup', requireAnon, requireFields, async (req, res, next) => {
  const { username, email, password, phone, timeTable } = req.body;
  try {
    const result = await User.findOne({ username });
    if (result) {
      req.flash('validation');
      res.redirect('/auth/signup');
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      username,
      email,
      password: hashedPassword,
      phone,
      timeTable
    };
    const createdUser = await User.create(newUser);
    req.session.currentUser = createdUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('validation')
  };
  res.render('auth/login', data);
});

router.post('/login', requireAnon, requireFields, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash('validation', 'Username or password incorrect');
      res.redirect('/auth/login');
      return;
    }
    // comparar contrasena
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

router.get('/logout', requireUser, async (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
