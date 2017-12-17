const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Add an order
router.post('/', (req, res, next) => {
    let newOrder = new Order({
        orderNb: req.body.orderNb,
        orderDate: req.body.orderDate,
        clientName: req.body.clientName,
        contactNb: req.body.contactNb,
        address: req.body.address,
        products: req.body.products,
        subAmount: req.body.subAmount,
        totalAmount: req.body.totalAmount,
        VAT: req.body.VAT,
        profit: req.body.profit,
        discount: req.body.discount,
        grandTotal: req.body.grandTotal,
        paidAmount: req.body.paidAmount,
        dueAmount: req.body.dueAmount,
        paymentType: req.body.paymentType,
        paymentStatus: req.body.paymentStatus,
        orderStatus: req.body.orderStatus,
        trackNb: req.body.trackNb
    });
    console.log('newOrder => ' + JSON.stringify(newOrder, null, 4));

    Order.addOrder(newOrder, (err) => {
        if (err) {
            res.json({success: false, msg: 'Failed to add an order', data: err});
        } else {
            res.json({success: true, msg: 'Order added'});
        }
    });

});

// Get all orders
router.get('/', (req, res, next) => {
    Order.listAllOrder((err, orders) => {
        if (err) {
            res.json({success: false, msg: 'Failed to load all orders', data: err});
        } else {
            res.json({success: true, msg: 'ALl orders loaded', data: orders});
        }
    });
});

// Get an order by its id
router.get('/:orderID', (req, res, next) => {
    Order.getOrderById(req.params.orderID, (err, order) => {
        if (err) {
            res.json({success: false, msg: 'Cannot get the order', data: err});
        } else {
            res.json({success: true, msg: 'Order loaded', data: order});
        }
    });
});

// Remove an order
router.delete('/:orderID', (req, res, next) => {
    Order.removeOrder(req.params.orderID, (err, order) => {
        if (err) {
            res.json({success: false, msg: 'Failed to remove the order', data: err});
        } else {
            res.json({success: true, msg: 'Order removed', data: order});
        }
    });
});

// Update an order
router.put('/:orderID', (req, res, next) => {
    let updatedOrder = req.body;
    Order.updateOrder(req.params.orderID, updatedOrder, (err, order) => {
        if (err) {
            res.json({success: false, msg: 'Failed to update the order', data: err});
        } else {
            res.json({success: true, msg: 'The order updated', data: order});
        }
    });
});

module.exports = router;

