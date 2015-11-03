var Bill = require('mongoose').model('Bill');

module.exports = function (router) {
    router.put('/pay', function (req, res, next) {
        Bill.findById(req.body._id, function (err, bill) {
            if (err) {
                return res.send('Error when locating bill.');
            }
            if (!bill) {
                console.log('Error, did not find bill.');
                return res.send('Did not find bill.');
            }
            if (req.body.hasOwnProperty('jpaid')) {
                bill.jpaid = req.body.jpaid;
            }
            if (req.body.hasOwnProperty('bpaid')) {
                bill.bpaid = req.body.bpaid;
            }
            bill.save(function () {
                res.send('OK');
            });
        });
    });
};