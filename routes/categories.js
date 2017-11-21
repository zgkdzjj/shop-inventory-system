const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//Add a Category
router.post('/', (req, res, next) => {
    let newCat = new Category({
        catName: req.body.catName,
        catStatus: req.body.catStatus
    });
    console.log('newCat => ' + newCat);
    Category.addCat(newCat, (err) => {
        if (err) {
            res.json({success: false, msg: 'failed to add a category'});
        } else {
            res.json({success: true, msg: 'Category added'});
        }
    });

});

// List all categories
router.get('/', (req, res, next) => {
    Category.listAllCat((err, cat) => {
        if (err) {
            res.json({success: false, msg: 'failded to list all categories', data: err});
        } else {
            res.json({success: true, msg: 'All Categories loaded', data: cat});
        }
    });
});

// Get a category
router.get('/:catID', (req, res, next) => {

    Category.getCatByID(req.params.catID,(err, cat) =>{
        if(err){
            res.json({success: false, msg: 'cannot get a category', data: err});
        } else {
            res.json({success: true, msg: 'The category loaded', data: cat});
        }
    });
});

// Remove a category
router.delete('/:catID', (req, res, next) => {
    Category.removeCat(req.params.catID, (err, cat) => {
        if(err) {
            res.json({success: false, msg: 'The category is not removed', data: err});
        } else {
            res.json({success: true, msg: 'The category is removed', data: cat});
        }
    });
});

// Update a category
router.put('/:catID', (req, res, next) => {
    let updatedCat = req.body;
    console.log('updated category => ' + JSON.stringify(updatedCat, null, 4));
    Category.updateCat(req.params.catID, updatedCat, (err, cat) => {
        if (err) {
            res.json({success: false, msg: 'Failed to update the category', data: err});
        } else {
            res.json({success: true, msg: 'The category updated', data: cat});
        }
    });
});

module.exports = router;


