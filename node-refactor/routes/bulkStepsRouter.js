const express = require('express');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
  });
const router = express.Router();
const controller = require('../controllers/bulkStepController');
const decodeTokenMiddleware = require('../middlewares/decodeTokenMiddleware');
  


router.post('/:listingId',decodeTokenMiddleware ,upload.single('file') ,controller.createBulkSteps);
  
module.exports = router;