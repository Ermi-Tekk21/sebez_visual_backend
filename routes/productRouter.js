const express = require("express");
const {
  fetch,
  create,
  update,
  deleteProduct,
} = require("../controller/productController");

const auth = require("../middleware/auth");
const router = express.Router();

// Define route for fetching data
router.get("/getallProducts", fetch);
router.post("/createProduct", auth, create);
router.put("/updateProduct/:id", auth, update);
router.delete("/deleteProduct/:id", auth, deleteProduct);

module.exports = router;
