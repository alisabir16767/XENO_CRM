const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  })
);
router.get("/user", (req, res) => {
  try {
    if (req.isAuthenticated() && req.user) {
      const user = {
        name: req.user.name || req.user.displayName || "No Name",
        avatar:
          req.user.photos && req.user.photos.length > 0
            ? req.user.photos[0].value
            : req.user.avatar || "",
      };
      res.json(user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error in /user route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
  // Clear the session or token
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.status(200).json({ message: "Logout successful" });
  });
});

module.exports = router;
