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

module.exports = router;
