const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');
const config = require('../config/database');

// Add Brand
router.post('/', (req, res, next) => {
   let newBrand = new Brand({
       brandName: req.body.brandName,
       brandStatus: req.body.brandStatus
   });
    console.log('newBrand => ' + newBrand);
    Brand.addBrand(newBrand, (err) => {
        if(err) {
            res.json({success: false, msg: 'failed to add the brand'});
        } else {
            res.json({success: true, msg: 'Brand added'});
        }
    })
});


// List All Brands
router.get('/', (req, res, next) => {
    Brand.listAllBrands((err, brands) => {
        if (err){
            res.json({success: false, msg: 'Cannot list all brands'});
        } else {
            res.json({success: true, msg: 'Load all brands successfully', data: brands});
        }
    })
});

// Get A Brand
router.get('/:brandID', (req, res, next) => {
    Brand.getBrandById(req.params.brandID, (err, brand) => {
        if(err) {
            res.json({success: false, msg: 'Cannot get a brand'});
        } else {
            res.json({success: true, msg: 'load a brand successfully', data: brand});
        }
    })
});

//Remove A Brand
router.delete('/:brandID', (req, res, next) => {
    Brand.removeBrand(req.params.brandID, (err, brand) => {
        if (err) {
            res.json({success: false, msg: 'The brand is not removed'});
        } else {
            res.json({success: true, msg: 'The brand is removed', data: brand});
        }
    })
});

// Update A Brand
router.put('/:brandID', (req, res, next) => {
    let updatedBrand = req.body;
    console.log('newBrand => ' + JSON.stringify(updatedBrand, null, 4));
    Brand.updateBrand(req.params.brandID, updatedBrand,(err, brand) => {
        if (err) {
            console.log(err);
            res.json({success: false, msg: 'Failed to update the brand'});
        } else {
            res.json({success: true, msg: 'Update the brand succeed', data: brand});
        }
    })
});



module.exports = router;