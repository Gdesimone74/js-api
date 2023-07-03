const express = require('express');
const router = express.Router();
const controller = require('../controllers/listingController');
const decodeTokenMiddleware = require('../middlewares/decodeTokenMiddleware');
  
  router.put('/:listingId', decodeTokenMiddleware, controller.update);
  
  module.exports = router;