const mongoose = require('mongoose');

// Define category schema
const CatSchema = mongoose.Schema({
    catName: {type: String},
    catStatus: {type: String}
});

// Define category model
const Category = module.exports = mongoose.model('Category', CatSchema);

module.exports.listAllCat = function (callback) {
    Category.find({}, callback);
}

module.exports.getCatByID = function (id,callback) {
    Category.findById(id, callback)
};

module.exports.getCatByName = function (catName, callback) {
    const query = {catName: catName};
    Category.findOne(query, callback);
};

module.exports.addCat = function (newCat, callback) {
    newCat.save(callback);
};

module.exports.removeCat = function (id, callback) {
    Category.findOneAndRemove({_id: id}, callback);
}

module.exports.updateCat = function (id, updatedCat, callback) {
    Category.findOneAndUpdate({_id: id}, updatedCat, {new: true}, callback)
};