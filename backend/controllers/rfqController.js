const RFQ = require('../models/RFQ');

// @desc    Get all RFQs
// @route   GET /api/rfqs
// @access  Private
const getRFQs = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const rfqs = await RFQ.find(query)
      .populate('assignedVendors')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: rfqs.length,
      data: rfqs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single RFQ
// @route   GET /api/rfqs/:id
// @access  Private
const getRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate('assignedVendors')
      .populate('createdBy', 'name email');

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create RFQ
// @route   POST /api/rfqs
// @access  Private
const createRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populatedRFQ = await RFQ.findById(rfq._id)
      .populate('assignedVendors')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRFQ,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update RFQ
// @route   PUT /api/rfqs/:id
// @access  Private
const updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedVendors')
      .populate('createdBy', 'name email');

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    res.json({
      success: true,
      data: rfq,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete RFQ
// @route   DELETE /api/rfqs/:id
// @access  Private
const deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    res.json({
      success: true,
      message: 'RFQ deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRFQs, getRFQ, createRFQ, updateRFQ, deleteRFQ };
