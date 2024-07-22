const { Product, validateProduct } = require("../model/productModel");
const _ = require("lodash");

const create = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "artist")
    return res.status(401).send("Admin or artist only operation.");

  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let product = await Product.findOne({ item_name: req.body.item_name });
    if (product) return res.status(400).send("Product already exists.");

    // Create a new product object with the provided data including imageUrl
    product = new Product({
      category: req.body.category,
      item_name: req.body.item_name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      imageUrl: req.body.imageUrl, // Include imageUrl field
    });

    await product.save();

    res.send({
      success: _.pick(product, ["category", "item_name", "imageUrl"]),
    });
  } catch (err) {
    // Log the error and send a 500 response with a server error message
    console.error("Error creating product:", err);
    res.status(500).send("Server Error");
  }
};

const fetch = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0)
      return res.status(404).json({ message: "No products created yet." });
    return res.status(200).json(products);
  } catch (error) {
    // Log the error and send a 500 response with a server error message
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "artist")
    return res.status(401).send("admin or artist only opration user can't.");

  try {
    const id = req.params.id;
    const ProductExist = await Product.findOne({ _id: id });
    if (!ProductExist) {
      // If user not found, send a 404 response with an error message
      return res.status(404).json({ message: "product not found" });
    }
    // Update the user with the new data and return the updated user
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });

    res.status(202).json(updateProduct); // Send the updated user in the response
  } catch (error) {
    // Log the error and send a 500 response with a server error message
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "artist")
    return res.status(401).send("admin or artist only opration.");

  try {
    const id = req.params.id; // Get the user ID from the request parameters

    // Check if the user exists in the database
    const productExist = await Product.findOne({ _id: id });
    if (!productExist) {
      // If product not found, send a 404 response with an error message
      return res.status(404).json({ message: "product not found" });
    }

    // Delete the user from the database
    await Product.findByIdAndDelete(id);
    res.status(202).json({ message: "product deleted successfully." }); // Send a success message in the response
  } catch {
    // If an error occurs, send a 500 response with a server error message
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Export the CRUD functions to be used in other parts of the application
module.exports = {
  create,
  fetch,
  update,
  deleteProduct,
};
