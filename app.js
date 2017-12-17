

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();
const users = require('./routes/users');
const brands = require('./routes/brands');
const categories = require('./routes/categories');
const products = require('./routes/products');
const orders = require('./routes/orders');
const config = require('./config/database');



// Managing the Mongoose connection
// Create the database connection
mongoose.connect(config.database);





// CONNECTION EVENTS
//When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection open to ' + config.database);

});

// If the connection throws an error
mongoose.connection.on('error', (err)=> {
    console.log('Mogoose default connection error:r ' + err);

});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mogoose default connection disconnected')
});

//app.set('mongoInstance', mongoose.connection.db);

const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Passport Middleware

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


app.use('/users', users);

// Add And Remove Brand
app.use('/brands', brands);

// Add and remove category
app.use('/categories', categories);

// Add and remove products
app.use('/products', products);

// Add and remove orders
app.use('/orders', orders);

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint')
});

// Start Server
app.listen(port,() => {
    console.log('Server started on port ' + port)
});

