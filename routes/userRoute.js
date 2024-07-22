const express = require("express");
const {
  fetch,
  create,
  update,
  deleteUser,
} = require("../controller/userController");
const { User } = require("../model/userModel");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/getalluser", fetch); // Define route for fetching all users
router.post("/create", create); // Define route for creating a new user
router.put("/update/:id", update); // Define route for updating a user by ID
router.delete("/delete/:id", deleteUser); // Define route for deleting a user by ID

// Define route for fetching the authenticated user's data
router.get("/getMe", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Find the user by the ID stored in req.user, excluding the password field
    if (!user) return res.status(404).send("User not found"); // If user not found, return a 404 status with an error message
    res.send(user); // Send the user information
  } catch (ex) {
    res.status(500).send("Internal Server Error"); // If an error occurs, send a 500 status with a generic error message
  }
});

module.exports = router;
