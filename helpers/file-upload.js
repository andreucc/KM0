'use strict';

const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dhaabdh1e',
  api_key: 857123644722142,
  api_secret: 'qpGlXHidEcB-ZqZxN31Sj-HjsY8'
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'KM0',
  allowedFormats: ['jpg', 'png', 'pdf']
});

const parser = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      req.fileValidationError = true;
      return cb(null, false, new Error('Wrong file type uploaded'));
    }
    cb(null, true);
  }
});

module.exports = parser;
