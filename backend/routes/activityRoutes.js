const express = require('express');
const router = express.Router();
const { getActivityLogs, createActivityLog, getAnalytics } = require('../controllers/activityController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getActivityLogs)
  .post(protect, createActivityLog);

router.get('/analytics', protect, getAnalytics);

module.exports = router;
