const express = require('express');
const router = express.Router();
const { getRFQs, getRFQ, createRFQ, updateRFQ, deleteRFQ } = require('../controllers/rfqController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getRFQs)
  .post(protect, createRFQ);

router.route('/:id')
  .get(protect, getRFQ)
  .put(protect, updateRFQ)
  .delete(protect, deleteRFQ);

module.exports = router;
