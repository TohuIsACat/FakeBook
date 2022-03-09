const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  try {
    // bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json("Wrong username or password.");
    } else {
      // bcrypt
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong username or password.");
      } else {
        // choose prop to return
        const { password, createdAt, isAdmin, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
      }
    }
  } catch (e) {
    return res.status(404).json(e);
  }
});

module.exports = router;
