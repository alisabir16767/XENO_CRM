const CommunicationLog = require("../models/CommunicationLog");

exports.createCommunicationLog = async (req, res) => {
  try {
    const { customerId, compaignId, message, status } = req.body;

    const log = new CommunicationLog({
      customerId,
      compaignId,
      message,
      status,
    });

    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCommunicationLogs = async (req, res) => {
  try {
    const logs = await CommunicationLog.find()
      .populate("customerId", "name email")
      .populate("compaignId", "name message");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCommunicationLogById = async (req, res) => {
  try {
    const log = await CommunicationLog.findById(req.params.id)
      .populate("customerId", "name email")
      .populate("compaignId", "name message");
    if (!log) {
      return res.status(404).json({ message: "Communication log not found" });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateCommunicationLog = async (req, res) => {
  try {
    const { status } = req.body;
    const log = await CommunicationLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "Communication log not found" });
    }
    if (status) {
      log.status = status;
    }
    log.updatedAt = new Date();

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteCommunicationLog = async (req, res) => {
  try {
    const log = await CommunicationLog.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ message: "Communication log not found" });
    }
    res.json({ message: "Communication log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
