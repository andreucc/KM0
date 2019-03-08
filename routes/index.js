'use strict';
const { requireUser } = require('../middlewares/auth');
const User = require('../models/User');

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
module.exports = router;
