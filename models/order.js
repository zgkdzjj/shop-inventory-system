const mongoose = require('mongoose');

// Define ordered products schema
const orderProd = new mongoose.Schema({
    name: String,
    rate: Number,
    quantity: Number,
    total: Number

});
// Define orders schema
const OrderSchema = new mongoose.Schema({
    orderNb: String,
    orderDate: String,
    clientName: String,
    contactNb: String,
    address: String,
    products: [orderProd],
    subAmount: Number,
    totalAmount: Number,
    VAT: Number,
    profit: Number,
    discount: Number,
    grandTotal: Number,
    paidAmount: Number,
    dueAmount: Number,
    paymentType: String,
    paymentStatus: String,
    orderStatus: String,
    trackNb: String
});

const Order = module.exports = mongoose.model('Order', OrderSchema);

module.exports.listAllOrder = function (callback) {
    Order.find({}, callback);
};

module.exports.getOrderById = function (id, callback) {
    Order.findById(id, callback);
};

module.exports.addOrder = function (newOrder, callback) {
    newOrder.save(callback);
};

module.exports.removeOrder = function (id, callback) {
    Order.findOneAndRemove({_id: id}, callback);
};

module.exports.updateOrder = function (id, updatedOrder,callback) {
    Order.findOneAndUpdate({_id: id}, updatedOrder, {new: false}, callback);
};


