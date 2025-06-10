const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const aiRoute = require("./routes/gemini");

dotenv.config();

require("./config/passport");

const authRoute = require("./routes/authRoutes");
const customerRoute = require("./routes/customerRoutes");
const orderRoute = require("./routes/orderRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const communicationLogRoutes = require("./routes/communicationLogRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/", authRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/segments", segmentRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.use("/api/v1/communication-logs", communicationLogRoutes);
app.use("/api/ai", aiRoute);

app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
