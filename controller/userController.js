// Load required libraries
const _ = require("lodash"); // Utility library for working with objects and arrays
const bcrypt = require("bcrypt"); // Library for hashing passwords
const { User, validateUser } = require("../model/userModel"); // Importing the User model and validation function

// Function to create a new user
const create = async (req, res) => {
  try {
    // Validate the user data in the request body
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // 400 Bad Request if validation fails
    }

    // Check if a user with the same email already exists in the database
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists"); // 400 Bad Request if user already exists
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object with the provided data, excluding the password
    user = new User(_.pick(req.body, ["name", "email", "address", "role"]));
    user.password = hashedPassword;
    // user.password = req.body.password; if password is not hashed

    // Save the new user to the database
    await user.save();

    // Generate a JWT for the new user
    const token = user.generateAuthToken();
    res.header("x-auth-token", token);
    // Send the token in the response header and the user's name and email in the response body
    res.status(201).send(_.pick(user, ["name", "email"])); // 201 Created for successful creation
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Server Error"); // 500 Internal Server Error for unexpected errors
  }
};

// Function to fetch all users
const fetch = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users registered yet." }); // 404 Not Found if no users
    }

    // Send the users in the response with a 200 status code
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" }); // 500 Internal Server Error for unexpected errors
  }
};

// Function to update an existing user
const update = async (req, res) => {
  try {
    const id = req.params.id; // Get the user ID from the request parameters
    // Check if the user exists in the database
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" }); // 404 Not Found if user not found
    }

    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message); // 400 Bad Request if validation fails
    }

    console.log(req.body.password.length);
    if (req.body.password.length < 50) {
      console.log("password not hashed so ready to be hashed");
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
      }
    } else {
      console.log("password already hashed");
    }

    // Update the user with the new data and return the updated user
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });

    res.status(200).json(updatedUser); // 200 OK with updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" }); // 500 Internal Server Error for unexpected errors
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id; // Get the user ID from the request parameters

    // Check if the user exists in the database
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" }); // 404 Not Found if user not found
    }

    // Delete the user from the database
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." }); // 200 OK with success message
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" }); // 500 Internal Server Error for unexpected errors
  }
};

// Export the CRUD functions to be used in other parts of the application
module.exports = {
  fetch,
  create,
  update,
  deleteUser,
};
