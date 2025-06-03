const express = require("express");
const router = express.Router();
const communicationLogController = require("../controllers/communicationLog");

router.post("/", communicationLogController.createCommunicationLog);
router.get("/", communicationLogController.getAllCommunicationLogs);
router.get("/:id", communicationLogController.getCommunicationLogById);
router.put("/:id", communicationLogController.updateCommunicationLog);
router.delete("/:id", communicationLogController.deleteCommunicationLog);

module.exports = router;
