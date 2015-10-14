var mongoose = require('mongoose');
var Bill = mongoose.model('Bill');

module.exports = function (router) {
    router.get('/bills', function (req, res, next) {
        Bill.find({}, function (err, bills) {
            if (err) next(err);
            res.send(bills);
        });
    });
};