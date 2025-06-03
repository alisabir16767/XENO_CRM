const Campaign = require("../models/Campaign");
const Segment = require("../models/Segment");

exports.createCampaign = async (req, res) => {
  try {
    const { name, segmentId, message } = req.body;
    const segment = await Segment.findById(segmentId);
    if (!segment) {
      return res.status(404).json({
        success: false,
        message: "Segment not found",
      });
    }
    const campaign = new Campaign({
      name,
      segmentId,
      message,
    });
    await campaign.save();
    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("Campaign creation failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate(
      "segmentId",
      "name audienceSize"
    );
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "segmentId",
      "name"
    );
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRecentCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("segmentId", "name audienceSize");
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// FIXED: Changed function name from getRecentCampaignPerformance to getCampaignPerformance
exports.getCampaignPerformance = async (req, res) => {
  try {
    const recentCampaign = await Campaign.findOne()
      .sort({ createdAt: -1 })
      .populate("segmentId", "name audienceSize");
    if (!recentCampaign) {
      return res
        .status(404)
        .json({ success: false, message: "No campaigns found" });
    }
    // Example delivery stats — adjust this based on your app's logic
    const deliveryStats = {
      status: recentCampaign.status,
      delivered: recentCampaign.status === "delivered" ? 1 : 0,
      failed: recentCampaign.status === "failed" ? 1 : 0,
      pending: recentCampaign.status === "pending" ? 1 : 0,
      sent: recentCampaign.status === "sent" ? 1 : 0,
    };
    res.status(200).json({
      success: true,
      campaign: recentCampaign,
      deliveryStats,
    });
  } catch (error) {
    console.error("Error fetching recent campaign:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, segmentId, message, status } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    // Update the fields if provided
    if (name) campaign.name = name;
    if (segmentId) campaign.segmentId = segmentId;
    if (message) campaign.message = message;
    if (status) campaign.status = status;

    const updatedCampaign = await campaign.save();

    res.status(200).json({
      success: true,
      data: updatedCampaign,
    });
  } catch (error) {
    console.error("Campaign update failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
