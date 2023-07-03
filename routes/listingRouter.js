const express = require('express');
const router = express.Router();
const { Listing } = require('../models');
const controller = require('../controllers/listingController');

router.get('/:listingId', controller.get);

module.exports = router;