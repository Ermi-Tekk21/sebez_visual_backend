const Joi = require('joi');
const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Drawings', 'Sketches', 'Paintings', 'Sculptures', 'Portraits'],
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    imageUrl: { // New field for image URL
        type: String,
        required: true // Adjust as needed; this example assumes image URL is required
    }
});

// Compile the Product model using the productSchema
const Product = mongoose.model('Product', productSchema);

// Validation function using Joi
function validateProduct(product) {
    const schema = Joi.object({
        category: Joi.string().valid('Drawings', 'Sketches', 'Paintings', 'Sculptures', 'Portraits').required(),
        item_name: Joi.string().min(1).max(255).required(),
        description: Joi.string().min(1).required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.string().min(1).required(),
        imageUrl: Joi.string().uri().required() // Validate as URI (URL format)
    });

    return schema.validate(product);
}

module.exports = {
    Product,
    validateProduct
};
