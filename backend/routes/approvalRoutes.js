const express = require('express');
const router = express.Router();
const { getApprovals, getApproval, createApproval, approveQuotation, rejectQuotation } = require('../controllers/approvalController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getApprovals)
  .post(protect, createApproval);

router.route('/:id')
  .get(protect, getApproval);

router.route('/:id/approve')
  .post(protect, approveQuotation);

router.route('/:id/reject')
  .post(protect, rejectQuotation);

module.exports = router;
