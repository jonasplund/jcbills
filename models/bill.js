var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Bill = new Schema({
    receivedDate: Date,
    dueDate: Date,
    addedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    jpaid: Boolean,
    bpaid: Boolean,
    jmessage: String,
    bmessage: String,
    info: String,
    recipient: String,
    amount: Number
});

mongoose.model('Bill', Bill);