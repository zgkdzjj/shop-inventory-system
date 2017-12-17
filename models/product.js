const mongoose = require('mongoose');
const fs = require('fs');
const Grid = require('gridfs-stream');


// Define product schema
const ProductSchema = mongoose.Schema({
    prodImgName: {type: String},
    prodName: {type: String},
    prodQuantity: {type: Number},
    prodRate: {type: Number},
    prodBrand: {type: String},
    prodCat: {type: String},
    prodStatus: {type: String},
    //prodImg: { data: Buffer, contentType: String },
    prodSpecs: {type: String},
    //prodColor: {type: String}
});

// Define product model
const Product = module.exports = mongoose.model('Product', ProductSchema);



module.exports.listAllProd = function (callback) {
    Product.find({}, callback);
};

module.exports.getAllImg = function (callback) {

};

module.exports.getProdByID = function (id, callback) {
    Product.findById(id, callback);
};

module.exports.getImgByID = function (id, callback) {
    
}

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
    Product.findOneAndUpdate({_id: id}, updatedProd, {new: false}, callback);
}
