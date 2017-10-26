const mongoose = require('mongoose');

// Define brand schema
const BrandSchema = mongoose.Schema({
    brandName: {type: String},
    brandStatus: {type: String}
});

// Define brand model
const Brand = module.exports = mongoose.model('Brand', BrandSchema);

module.exports.listAllBrands = function (callback) {
    Brand.find({}, callback);
}

module.exports.getBrandById = function (id, callback) {
    Brand.findById(id, callback);
}

module.exports.getBrandByBrandName = function (brandName,callback) {
    const query = {brandName: brandName};
    Brand.findOne(query, callback);
}

module.exports.addBrand = function (newBrand, callback) {
    newBrand.save(callback);
}

module.exports.removeBrand = function (id, callback) {
    Brand.findOneAndRemove({_id: id}, callback);
}


module.exports.updateBrand = function (id,updatedBrand, callback) {
    Brand.findOneAndUpdate({_id: id}, updatedBrand,{new: true},callback);
}
