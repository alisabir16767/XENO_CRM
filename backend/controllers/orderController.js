const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { customer, order_amount } = req.body;
    const newOrder = new Order({
      customer,
      order_amount,
      order_date: Date.now(),
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create order",
      details: err.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch orders",
      details: err.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch order",
      details: err.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { order_amount } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { order_amount },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ error: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({
      error: "Failed to update order",
      details: err.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete order",
      details: err.message,
    });
  }
};

const getTotalEarnings = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalEarnings = orders.reduce(
      (sum, order) => sum + order.order_amount,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalEarnings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      details: err.message,
    });
  }
};

const getMonthlyEarnings = async (req, res) => {
  try {
    const monthlyEarnings = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$order_date" },
            month: { $month: "$order_date" },
          },
          totalEarnings: { $sum: "$order_amount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalEarnings: 1,
          orderCount: 1,
        },
      },
    ]);

    const formattedData = monthlyEarnings.map((item) => ({
      month: new Date(item.year, item.month - 1).toLocaleString("default", {
        month: "long",
      }),
      year: item.year,
      earnings: item.totalEarnings,
      orderCount: item.orderCount,
    }));

    res.json({
      success: true,
      data: formattedData,
      rawData: monthlyEarnings,
    });
  } catch (error) {
    console.error("Error fetching monthly earnings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly earnings data",
    });
  }
};
const getTotalOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        orderCount,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to get order count",
      details: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getTotalEarnings,
  getMonthlyEarnings,
  getTotalOrderCount,
};
