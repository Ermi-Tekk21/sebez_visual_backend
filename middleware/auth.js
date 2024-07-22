const jwt = require("jsonwebtoken");
const { User } = require("../model/userModel");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded; // Attach the decoded token data to req.user

    // Find the user by the email contained in the token
    let userExist = await User.findOne({ email: req.user.email });
    if (!userExist) 
      return res.status(404).json({ message: "There is no user with this token." });

    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    res.status(400).send("Invalid token."); // Handle invalid token errors
  }
};
