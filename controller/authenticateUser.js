// Load environment variables from .env file
require("dotenv").config(); // Ensure environment variables are loaded from .env file

const { User } = require("../model/userModel");
const bcrypt = require("bcrypt");

// Function to authenticate the user
const authenticateUser = async (req, res) => {
  try {
    // Find the user by name or email
    const user =
      (await User.findOne({ name: req.body.nameOrEmail })) ||
      (await User.findOne({ email: req.body.nameOrEmail }));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided password matches the user's hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Password does not match" });
    }

    // Ensure the private key is defined
    if (!process.env.PRIVATE_KEY) {
      console.error("FATAL ERROR: Private key is not defined.");
      process.exit(1); // Exit the process with a failure code
    }

    // Generate a JWT token
    const token = user.generateAuthToken(); // Ensure this method exists on the user model

    return res.status(200).json({ message: "Successfully logged in", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  authenticateUser,
};
