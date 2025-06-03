const Segment = require("../models/Segment");
const Customer = require("../models/Customer");

const matchesRule = (customer, rules) => {
  return rules.every(({ field, operator, value }) => {
    switch (operator) {
      case "$gt":
        return customer[field] > value;
      case "$lt":
        return customer[field] < value;
      case "$gte":
        return customer[field] >= value;
      case "$lte":
        return customer[field] <= value;
      case "$eq":
        return customer[field] === value;
      case "$ne":
        return customer[field] !== value;
      default:
        return false;
    }
  });
};

exports.createSegment = async (req, res) => {
  try {
    console.log("Received request to create a segment:", req.body);
    const { name, segmentRule, scheduledAt } = req.body;
    const customers = await Customer.find();
    const matchedCustomers = customers.filter((customer) =>
      matchesRule(customer, segmentRule)
    );

    const segment = new Segment({
      name,
      segmentRule,
      audienceSize: matchedCustomers.length,
      scheduledAt,
    });

    await segment.save();
    res.status(201).json({
      success: true,
      data: segment,
      matchedCustomers,
    });
  } catch (error) {
    console.error("Segment creation failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find();
    res.status(200).json({ success: true, data: segments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res
        .status(404)
        .json({ success: false, message: "Segment not found" });
    }
    res.status(200).json({ success: true, data: segment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSegment = async (req, res) => {
  try {
    const { name, segmentRule, scheduledAt } = req.body;
    const segment = await Segment.findById(req.params.id);

    if (!segment) {
      return res
        .status(404)
        .json({ success: false, message: "Segment not found" });
    }

    if (name) segment.name = name;
    if (segmentRule) {
      segment.segmentRule = segmentRule;

      const customers = await Customer.find();
      const matchedCustomers = customers.filter((customer) =>
        matchesRule(customer, segmentRule)
      );
      segment.audienceSize = matchedCustomers.length;
    }

    if (scheduledAt) segment.scheduledAt = scheduledAt;

    await segment.save();
    res.status(200).json({ success: true, data: segment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) {
      return res
        .status(404)
        .json({ success: false, message: "Segment not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Segment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
