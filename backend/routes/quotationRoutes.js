const express = require('express');
const router = express.Router();
const { getQuotations, getQuotation, createQuotation, updateQuotation, deleteQuotation, compareQuotations } = require('../controllers/quotationController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuotations)
  .post(protect, createQuotation);

router.route('/compare/:rfqId')
  .get(protect, compareQuotations);

router.route('/:id')
  .get(protect, getQuotation)
  .put(protect, updateQuotation)
  .delete(protect, deleteQuotation);

module.exports = router;
