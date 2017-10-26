const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config/database');

module.exports = function (passport) {
    var opts = {};
    console.log('hello11');
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    //opts.jwtFromRequest = ExtractJwt.fromBodyField('token');
    //opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('token');
    //opts.jwtFromRequest = ExtractJwt.fromHeader('token');
    opts.secretOrKey = config.secret;
    console.log('opts = ' + JSON.stringify(opts, null, 4) );
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('jwt_payload: ' + JSON.stringify(jwt_payload, null, 4));
        User.getUserById(jwt_payload._doc._id, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                 done(null, user);
            } else {
                 done(null, false);
            }
        });
    }));

}