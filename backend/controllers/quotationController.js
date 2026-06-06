const Quotation = require('../models/Quotation');
const RFQ = require('../models/RFQ');

// @desc    Get all quotations
// @route   GET /api/quotations
// @access  Private
const getQuotations = async (req, res) => {
  try {
    const { rfqId, vendorId, status } = req.query;

    let query = {};

    if (rfqId) {
      query.rfqId = rfqId;
    }

    if (vendorId) {
      query.vendorId = vendorId;
    }

    if (status) {
      query.status = status;
    }

    const quotations = await Quotation.find(query)
      .populate('rfqId')
      .populate('vendorId')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quotation
// @route   GET /api/quotations/:id
// @access  Private
const getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('rfqId')
      .populate('vendorId');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create quotation
// @route   POST /api/quotations
// @access  Private
const createQuotation = async (req, res) => {
  try {
    const { rfqId, vendorId, items, notes } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const quotation = await Quotation.create({
      rfqId,
      vendorId,
      items,
      totalAmount,
      notes,
    });

    const populatedQuotation = await Quotation.findById(quotation._id)
      .populate('rfqId')
      .populate('vendorId');

    res.status(201).json({
      success: true,
      data: populatedQuotation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quotation
// @route   PUT /api/quotations/:id
// @access  Private
const updateQuotation = async (req, res) => {
  try {
    // Recalculate total if items are updated
    if (req.body.items) {
      req.body.totalAmount = req.body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('rfqId')
      .populate('vendorId');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quotation
// @route   DELETE /api/quotations/:id
// @access  Private
const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json({
      success: true,
      message: 'Quotation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compare quotations for an RFQ
// @route   GET /api/quotations/compare/:rfqId
// @access  Private
const compareQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ rfqId: req.params.rfqId })
      .populate('rfqId')
      .populate('vendorId')
      .sort({ totalAmount: 1 });

    res.json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuotations, getQuotation, createQuotation, updateQuotation, deleteQuotation, compareQuotations };
