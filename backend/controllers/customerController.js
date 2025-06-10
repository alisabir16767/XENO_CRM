const Customer = require("../models/Customer");
const Order = require("../models/Order");

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, totalSpend, visitCount, lastOrderDate } =
      req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      totalSpend,
      visitCount,
      lastOrderDate,
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, totalSpend, visitCount, lastOrderDate } =
      req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, totalSpend, visitCount, lastOrderDate },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCustomerInvestments = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $group: {
          _id: {
            month: { $month: "$order_date" },
            customerId: "$customer._id",
            customerName: "$customer.name",
          },
          totalInvestments: { $sum: "$order_amount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          customers: {
            $push: {
              id: "$_id.customerId",
              name: "$_id.customerName",
              investments: "$totalInvestments",
              orders: "$orderCount",
            },
          },
          desktop: { $sum: "$totalInvestments" },
          mobile: { $sum: "$orderCount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const chartData = data.map((item) => ({
      month: monthNames[item._id - 1],
      desktop: item.desktop,
      mobile: item.mobile,
      customers: item.customers,
    }));

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
