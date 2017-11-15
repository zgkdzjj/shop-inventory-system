const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Define product schema
const ProductSchema = mongoose.Schema({
    //prodImg: {data: Buffer, contentType: String},
    prodName: {type: String},
    prodQantity: {type: Number},
    prodRate: {type:String},
    prodBrand: {type: String},
    prodCat: {type: String},
    prodStatus: {type: String}
});

// Define product model
const Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.listAllProd = function (callback) {
    Product.find({}, callback);
};

module.exports.getProdByID = function (id, callback) {
    Product.findById(id, callback);
};

module.exports.getProdByName = function (prodName, callback) {
    const query = {prodName: prodName};
    Product.findOne(query, callback);
};

module.exports.addProd = function (newProd, callback) {
    newProd.save(callback);
};

module.exports.removeProd = function (id, callback) {
    Product.findOneAndRemove({_id: id}, callback);
};

module.exports.updateProd = function (id, updatedProd, callback) {
    Product.findOneAndUpdate({_id: id}, updatedProd, {new: true}, callback);
}
