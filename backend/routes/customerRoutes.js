const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerInvestments,
} = require("../controllers/customerController");
const router = express.Router();

router.post("/", createCustomer);
router.get("/", getAllCustomers);
router.get("/investments", getCustomerInvestments);
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
