var Bill = require('mongoose').model('Bill');
var nodemailer = require('nodemailer');
var config = require('../../config.js');

module.exports = function (router) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: config.email.from
    });

    router.post('/bill', function (req, res, next) {
        var bill = new Bill({
            receivedDate: req.body.received,
            dueDate: req.body.due,
            recipient: req.body.recipient,
            info: req.body.info,
            amount: req.body.amount,
            jmessage: req.body.jmessage,
            bmessage: req.body.bmessage
        });
        bill.save(function () {
            console.log('New bill added. Sending mail...');

            transporter.sendMail({
                from: 'JCBills',
                to: config.email.to,
                subject: 'Activity on JCBills',
                html: 'A new bill has been added:<br /><br />' + 
                    'Due: ' + req.body.due + '<br />' +
                    'Amount: ' + req.body.amount + ' SEK<br />' +
                    'Recipient: ' + req.body.recipient + '<br />' +
                    'Additional info: ' + req.body.info + '<br /><br />' +
                    'Visit <a href="' + config.web.host + ':' + config.web.port + '">our site</a> for more info.'
            }, function (err, info) {
                if (err) return console.log('err', err);
                console.log('Mail sent.');
            });
            res.send('OK');
        });
    });
    
    router.put('/bill', function (req, res, next) {
       if (!req.body._id) {
           return res.status(500).send('Error: No id.');
       }
       Bill.findById(req.body._id, function (err, bill) {
            if (err) {
                return res.status(500).send('Error when locating bill.');
            }
            bill.receivedDate = req.body.received;
            bill.dueDate = req.body.due;
            bill.recipient = req.body.recipient;
            bill.info = req.body.info;
            bill.amount = req.body.amount;
            bill.jmessage = req.body.jmessage;
            bill.bmessage = req.body.bmessage;
            bill.save();
            res.send('OK');
       });
    });

    router.delete('/bill', function (req, res, next) {
        if (!req.body._id) {
            return res.status(500).send('Error: No id.');
        }
        Bill.findById(req.body._id, function(err, bill) {
            bill.remove(function (err) {
                if (err) return res.status(500).send('Error when removing bill.');
                res.send('OK');
            });
        });
    });
}