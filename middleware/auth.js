const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../model/userModel");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("mail.JwtPrivateKey"));
    req.user = decoded; // Attaching to req for accessibility in subsequent middleware and handlers

    let userExist = await User.findOne({ email: req.user.email });
    if (!userExist)
      return res
        .status(404)
        .json({ message: "There is no user with this token." });

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
// 