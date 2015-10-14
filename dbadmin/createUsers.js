var mongoose    = require('mongoose');
var crypto = require('crypto');
require('../models');
var User = require('mongoose').model('User');
var hash = require('../helpers/hash.js');
var config      = require('../config.js');

mongoose.connect(config.db.host + '/' + config.db.name);
var db = mongoose.connection;

var users = config.app.users;

var createUsers = function (usrobjs, callback) {
    usrobjs.map(function (usrobj) {
        crypto.randomBytes(16, function (err, salt) {
            if (err) callback(err);
            salt = salt.toString('utf8');
            var hashed = hash(usrobj.password, salt);
            var newUser = new User({
                _id: usrobj.username,
                firstname: usrobj.firstname,
                lastname: usrobj.lastname,
                salt: salt,
                hash: hashed
            });
            try {
                newUser.save(function (err) {
                    if (err) callback(err);
                    console.log('Admin user created.');
                    callback();
                });
            } catch (e) {
                console.log('Admin already exists.');
                callback();
            }
        });    
    });
}


db.on('error', function (err) { 
    console.log('error', 'DB error: ', err); 
});

db.once('open', function () {
    createUsers(users, function () { console.log('Done.'); });
});