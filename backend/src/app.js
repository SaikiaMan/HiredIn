const express = require("express");
const router = express.Router();

const userModel = require("./models/userModel");
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
      res.redirect("/profile");
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  })
);

// logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;