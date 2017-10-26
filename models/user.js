const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Define user schema
const UserSchema = mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

// Defind user model
const User = module.exports =  mongoose.model('User', UserSchema);



module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err,salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) throw err;
            console.log('hash = ' + hash);
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

// Check password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword,hash, (err, res) => {
        if (err) throw err;
        callback(null, res);
    })
};