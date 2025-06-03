const express = require("express");
const router = express.Router();
const { generateMessage } = require("../controllers/gemini");
const { createSegmentFromPrompt } = require("../controllers/gemini");

router.post("/generate", generateMessage);
router.post("/rule-generator", createSegmentFromPrompt);

module.exports = router;
