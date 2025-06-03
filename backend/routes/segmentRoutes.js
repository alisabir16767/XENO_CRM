const express = require("express");
const router = express.Router();
const {
  createSegment,
  getAllSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
} = require("../controllers/segmentController");

router.post("/", createSegment);
router.get("/", getAllSegments);
router.get("/:id", getSegmentById);
router.put("/:id", updateSegment);
router.delete("/:id", deleteSegment);

module.exports = router;
