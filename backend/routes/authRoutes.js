const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: true, // Make sure session is stored
  }),
  (req, res) => {
    // Successful auth — now redirect
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get("/user", (req, res) => {
  try {
    if (req.isAuthenticated() && req.user) {
      const user = {
        name: req.user.name || req.user.displayName || "No Name",
        avatar:
          req.user.photos?.[0]?.value || req.user.avatar || "",
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
  req.logout(function(err) {
    if (err) return res.status(500).json({ message: "Logout failed" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        path: "/",
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ message: "Logout successful" });
    });
  });
});

module.exports = router;