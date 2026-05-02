const express = require("express");
const router = express.Router();

const userModel = require("./models/userModel");
const eventRoutes = require("./routes/eventRoutes");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// configure passport
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get("/", (req, res) => {
  res.json({ title: "Express" });
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.send("Profile Page");
});

// register
router.post("/register", async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;

    const userData = new userModel({
      username,
      email,
      fullname,
    });

    const registeredUser = await userModel.register(userData, password);

    passport.authenticate("local")(req, res, function () {
      res.json({ 
        message: "Registration successful",
        username: registeredUser.username,
        email: registeredUser.email,
        fullname: registeredUser.fullname
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Authentication error" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      return res.json({
        message: "Login successful",
        username: user.username,
        email: user.email,
        fullname: user.fullname
      });
    });
  })(req, res, next);
});

// logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

// Event routes
router.use("/", eventRoutes);

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;