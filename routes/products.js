const express = require('express');
const multer = require('multer');
const upload = multer({dest: "./uploads"});
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
const conn = mongoose.connection;

const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


conn.once('open', () => {
    const gfs = Grid(conn.db);
    console.log('connection open');
    router.get('/', () => {});


    // Add Product
    router.post('/',upload.single('avatar'), (req, res, next) => {
        let newProd = new  Product({
            prodName: req.body.prodName,
            prodQantity: req.body.prodQantity,
            prodRate: req.body.prodRate,
            prodBrand: req.body.prodBrand,
            prodCat: req.body.prodCat,
            prodStatus: req.body.prodStatus
        });
        //console.log('req.files => ' + req.files);
        console.log('req.file => ' + JSON.stringify(req.file, null, 4));
        console.log('gfs => ' + gfs);

        const writestream = gfs.createWriteStream({
            filename: req.file.filename
        });

        // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
        fs.createReadStream("./uploads/" + req.file.filename)
            //.on("end", function(){fs.unlink("./uploads/"+ req.file.filename, function(err){res.send("success")})})
            .on("err", function(){res.send("Error uploading image")})
            .pipe(writestream);


        /*Product.addProd(newProd, (err) => {
            if(err) {
                res.json({success: false, msg: 'failed to add the product'});
            } else {
                res.json({success: true, msg: 'product added'});
            }
        })*/
    });


});



module.exports = router;