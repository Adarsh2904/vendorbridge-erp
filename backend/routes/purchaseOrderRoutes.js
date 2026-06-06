const express = require('express');
const router = express.Router();
const { getPurchaseOrders, getPurchaseOrder, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = require('../controllers/purchaseOrderController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPurchaseOrders)
  .post(protect, createPurchaseOrder);

router.route('/:id')
  .get(protect, getPurchaseOrder)
  .put(protect, updatePurchaseOrder)
  .delete(protect, deletePurchaseOrder);

module.exports = router;
