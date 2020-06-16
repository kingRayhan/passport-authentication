var express = require("express");
var router = express.Router();
const { index, store } = require("quick-crud");
const User = require("../models/User");
const passport = require("passport");

router.get("/", async (req, res, next) => {
  const users = await index({ model: User });
  res.json(users);
});

http: router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.post("/register", async (req, res) => {
  const user = await store({ model: User, data: req.body });
  res.json(user);
});

router.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get(
  "/github",
  passport.authenticate("github", {
    session: false,
  })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
