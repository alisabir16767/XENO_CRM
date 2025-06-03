const express = require("express");
const router = express.Router();

const {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  deleteCampaign,
  getRecentCampaigns,
  getCampaignPerformance,
  updateCampaign,
} = require("../controllers/campaignController");

router.post("/", createCampaign);
router.get("/", getAllCampaigns);
router.get("/recent-performance", getRecentCampaigns);
router.get("/delivery-success-rate", getCampaignPerformance);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);
router.get("/:id", getCampaignById);

module.exports = router;
