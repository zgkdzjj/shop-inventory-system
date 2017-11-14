const mongoose = require('mongoose');

// Define product schema
const ProductSchema = mongoose.Schema({
    proImg: {data: Buffer, contentType: String},
    
})