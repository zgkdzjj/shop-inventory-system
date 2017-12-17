const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
const conn = mongoose.connection;
const products = [];


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
    var gfs = Grid(conn.db);
    console.log('connection open');

    // Add Product
    router.post('/', upload.single('avatar'), (req, res, next) => {
        console.log('req.file => ' + JSON.stringify(req.file, null, 4));
        console.log('req.body => ' + JSON.stringify(req.body, null, 4));

        if (req.file == undefined) {
            var newProd = new Product({
                //prodImgName: req.file.filename,
                prodName: req.body.prodName,
                prodQuantity: req.body.prodQuantity,
                prodRate: req.body.prodRate,
                prodBrand: req.body.prodBrand,
                prodCat: req.body.prodCat,
                prodStatus: req.body.prodStatus,
                prodSpecs: req.body.prodSpecs
            });
        } else {
            var newProd = new Product({
                prodImgName: req.file.filename,
                prodName: req.body.prodName,
                prodQuantity: req.body.prodQuantity,
                prodRate: req.body.prodRate,
                prodBrand: req.body.prodBrand,
                prodCat: req.body.prodCat,
                prodStatus: req.body.prodStatus,
                prodSpecs: req.body.prodSpecs
            });
        }
        console.log('newProd => ' + newProd);

        // Add product to db
        Product.addProd(newProd, (err) => {
            if (err) {
                res.end(JSON.stringify({success: false, msg: 'failed to add the product'}));
                console.log('failed to add the product info')

            } else {
                console.log('product info added');
                if (req.file == undefined) {
                    res.json({success: true, msg: 'Product info has been added, but image file not selected'})
                } else {
                    let path = './uploads/' + req.file.filename;
                    saveFileToDB(path, req, res);
                }

            }
        });
        //}
    });

    // Get all products
    router.get('/', (req, res, next) => {
        var buffer = "";
        Product.listAllProd((err, prod) => {
            //var products = new Array();
            if (err) {
                res.json({success: false, msg: 'failed to get all product from db', data: err});

            } else {
                console.log('prod.data => ' + JSON.stringify(prod, null, 4));
                res.json({success: true, msg: 'All products loaded', data: prod});
                //products.length = 0;
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

    // get a product's image
    router.get('/images/:imgName', (req, res, next) => {

        conn.collection('fs.files').findOne({filename: req.params.imgName}, (err, file) => {
            if (err) {
                res.json({success: false, msg: 'Loading file error', data: err});
            } else {
                if (file == undefined) {
                    console.log('file undefined');
                    res.json({success: false, msg: 'Cannot find the image file.', data: null});

                } else {
                    console.log('file => ' + JSON.stringify(file, null, 4));
                    conn.collection('fs.chunks').findOne({files_id: file._id}, (err, imgChunks) => {
                        if (err) throw err;
                        //console.log('doc => ' + JSON.stringify(doc, null, 4));
                        res.json({success: true, msg: 'image file loaded', data: imgChunks});
                    });
                }


            }
        });
    });

    // remove a product
    router.delete('/:prodID', (req, res, next) => {
        //var gfs = Grid(conn.db);
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
        //var gfs = Grid(conn.db);
        let updatedProd = req.body;
        console.log('updated product => ' + JSON.stringify(req.body, null, 4));
        if (req.file == undefined) {
            Product.updateProd(req.params.prodID, updatedProd, (err, prod) => {
                if (err) {
                    res.json({success: false, msg: 'Failed to update the product', data: err});
                } else {
                    res.json({success: true, msg: 'Product updated ', data: prod});

                }
            });

        } else {
            let path = './uploads/' + req.file.filename;
            updatedProd.prodImgName = req.file.filename;
            console.log('req.file => ' + JSON.stringify(req.file, null, 4));
            Product.updateProd(req.params.prodID, updatedProd, (err, prod) => {
                console.log('prod => ' + prod);
                if (err) {
                    res.json({success: false, msg: 'Failed to update the product', data: err});
                } else {
                    // Save the new image to the db
                    saveFileToDB(path, req, res);
                    // remove the old image from the db
                    if (prod.prodImgName == undefined) {
                        console.log('No old images needed to be removed');
                    } else {
                        console.log('before removed prodImgName => ' + prod.prodImgName);
                        gfs.remove({filename: prod.prodImgName}, (err) => {
                            if (err) {
                                throw err
                            }
                            else {
                                console.log('Old images removed.');
                            }
                        })
                    }


                }
            });

        }

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