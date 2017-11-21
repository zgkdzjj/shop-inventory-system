const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
const conn = mongoose.connection;

const Grid = require('gridfs-stream');
const upload = multer({
    dest: "./uploads",
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
//const path = './uploads/';

Grid.mongo = mongoose.mongo;

// Check Connection to db
conn.once('open', () => {
    //const gfs = Grid(conn.db);
    console.log('connection open');

    // Add Product
    router.post('/', upload.single('avatar'), (req, res, next) => {

        console.log('req.file => ' + JSON.stringify(req.file, null, 4));
        console.log('req.body => ' + JSON.stringify(req.body, null, 4));
        if (req.file == undefined) {
            res.json({success: false, msg: 'No File Selected'});
        }
        else {
            let newProd = new Product({
                prodImgName: req.file.filename,
                prodName: req.body.prodName,
                prodQuantity: req.body.prodQuantity,
                prodRate: req.body.prodRate,
                prodBrand: req.body.prodBrand,
                prodCat: req.body.prodCat,
                prodStatus: req.body.prodStatus
            });
            let path = './uploads/' + req.file.filename;
            console.log('newProd ' + newProd);

            // Add product to db
            Product.addProd(newProd, (err) => {
                if (err) {
                    res.end(JSON.stringify({success: false, msg: 'failed to add the product'}));
                    console.log('failed to add the product info')

                } else {
                    console.log('product info added');
                    console.log('path => ' + path);
                    saveFileToDB(path, req, res);
                }
            });
        }
    });

    // Get all products
    router.get('/', (req, res, next) => {
        Product.listAllProd((err, prod) => {
            if (err) {
                res.json({success: false, msg: 'failed to get all product from db', data: err});

            } else {
                res.json({success: true, msg: 'All products loaded', data: prod});
            }
        })
    });

    // gat a product
    router.get('/:prodID', (req, res, next) => {
        Product.getProdByID(req.params.prodID, (err, prod) => {
            if (err) {
                res.json({success: false, msg: 'cannot get a product', data: err});
            } else {
                res.json({success: true, msg: 'The product loaded', data: prod});
            }
        })
    });

    // remove a product
    router.delete('/:prodID', (req, res, next) => {
        var gfs = Grid(conn.db);
        Product.removeProd(req.params.prodID, (err, prod) => {
            if (err) {
                res.json({success: false, msg: 'Failed to remove the product', data: err});
            } else {
                //remove the image
                gfs.remove({filename: prod.prodImgName}, (err) => {
                    if (err) {
                        res.json({success: false, msg: 'Failed to remove the image.', data: err});
                    } else {
                        res.json({success: true, msg: 'The product has been removed.'});
                    }
                })
            }
        });
    });

    // update a product
    router.put('/:prodID', upload.single('avatar'), (req, res, next) => {
        var gfs = Grid(conn.db);
        let updatedProd = req.body;
        let path = './uploads/' + req.file.filename;
        updatedProd.prodImgName = req.file.filename;
        console.log('updated product => ' + JSON.stringify(req.body, null, 4));
        Product.updateProd(req.params.prodID, updatedProd, (err, prod) => {
            if (err) {
                res.json({success: false, msg: 'Failed to update the product', data: err});
            } else {
                // Save the new image to the db
                saveFileToDB(path, req, res);
                // remove the old image from the db
                gfs.remove({filename: prod.prodImgName}, (err) => {
                    if (err) throw err;
                })

            }
        });
    });
});

// Upload File to the DB
function saveFileToDB(path, req, res) {
    const gfs = Grid(conn.db);
    // Add Product image to db
    const writestream = gfs.createWriteStream({
        filename: req.file.filename
    });

    //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream(path)
        .on("end", function () {
            fs.unlink(path, function (err) {
                if (err) {
                    res.json({success: false, msg: 'Failed to upload the image.'});
                } else {
                    res.json({success: true, msg: 'Product info added successfully'});
                }
            })
        })
        .on("err", function () {
            res.json({success: true, msg: 'Error uploading image'});
        })
        .pipe(writestream);
}

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const fileTypes = /jpeg|jpg|png|gif/;
    // Check ext
    //const extName = fileTypes.test(path.)

    // Check mime
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType) {
        return cb(null, true);
    } else {
        cb('Error: Images Only');
    }

}


module.exports = router;