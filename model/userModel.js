const mongoose = require("mongoose"); // Import Mongoose for MongoDB operations
const Joi = require("joi"); // Import Joi for data validation
const jwt = require("jsonwebtoken"); // Import JSON Web Token for creating and verifying tokens

// Mongoose schema for MongoDB
const userSchema = new mongoose.Schema({
  name: {
    type: String, // Field type: String
    required: true, // Field is required
    minlength: 3, // Minimum length of 3 characters
  },
  email: {
    type: String, // Field type: String
    required: true, // Field is required
    minlength: 6, // Minimum length of 6 characters
    maxlength: 255, // Maximum length of 255 characters
    unique: true, // Field must be unique
  },
  address: {
    type: String, // Field type: String
    required: true, // Field is required
    minlength: 3, // Minimum length of 3 characters
  },
  password: {
    type: String, // Field type: String
    required: true, // Field is required
    minlength: 8, // Minimum length of 8 characters
    maxlength: 1024, // Maximum length of 1024 characters
  },
  role: {
    type: String, // Field type: String
    required: true, // Field is required
    enum: ["user", "admin", "artist"], // Field must be one of the specified values
    default: "user", // Default value is "user"
  },
});

// Method to generate a JWT for the user
userSchema.methods.generateAuthToken = function () {
  // Generate a JWT
  const token = jwt.sign(
    { userId: this._id, name: this.name, email: this.email, role: this.role }, // Payload
    process.env.PRIVATE_KEY, // Secret key from environment variables
    { expiresIn: "1h" } // Token expiration time
  );
  return token; // Return the generated token
};

// Create a Mongoose model for the user schema
const User = mongoose.model("User", userSchema); // Changed model name to singular for consistency

// Function to validate user data using Joi
function validateUser(user) {
  // Define the validation schema
  const schema = Joi.object({
    name: Joi.string().min(3).required(), // Name: String, min length 3, required
    email: Joi.string().email().min(6).max(255).required(), // Email: Email format, min length 6, max length 255, required
    address: Joi.string().min(3).required(), // Address: String, min length 3, required
    password: Joi.string()
      .min(8) // Password: Minimum 8 characters
      .required() // Required
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")) // Pattern: at least one lowercase, one uppercase, one number, and one special character
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character", // Custom error message for pattern
      }),
    role: Joi.string().valid("user", "admin", "artist"), // Role: String, must be "user" or "admin" or "artist"
  });

  return schema.validate(user); // Validate the user data against the schema
}

// Export the User model and validateUser function
module.exports.User = User;
module.exports.validateUser = validateUser;
