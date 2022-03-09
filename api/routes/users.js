const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    // if want to update password
    if (req.body.password) {
      try {
        // bcrypt
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        return res.status(500).json(e);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          runValidators: true,
        }
      );
      res.status(200).json("Account has been updated.");
    } catch (e) {
      return res.status(500).json(e.message);
    }
  } else {
    return res.status(403).json("you can update only your account.");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted.");
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json("You can delete only your account.");
  }
});

// get a user
router.get("/", async (req, res) => {
  const userID = req.query.userID;
  const username = req.query.username;
  try {
    const user = userID
      ? await User.findById(userID)
      : await User.findOne({ username: username });
    // choose props to return
    const { password, createdAt, isAdmin, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// get friends
router.get("/friends/:userID", async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);
    const friends = await Promise.all(
      user.followings.map((friendID) => {
        return User.findById(friendID);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture, birthday } = friend;
      friendList.push({ _id, username, profilePicture, birthday });
    });
    res.status(200).json(friendList);
  } catch (e) {
    res.status(500).json(e);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userID !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (!user.followers.includes(req.body.userID)) {
        await user.updateOne({ $push: { followers: req.body.userID } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userID);
      if (user.followers.includes(req.body.userID)) {
        await user.updateOne({ $pull: { followers: req.body.userID } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

// get all users
router.get("/all", async (req, res) => {
  try {
    const allUser = await User.find();
    res.status(200).json(allUser);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
