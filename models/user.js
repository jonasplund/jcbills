var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    _id: { 
        type: String, 
        lowercase: true, 
        trim: true, 
        index: { 
            unique: true 
        } 
    },
    firstname: String,
    lastname: String,
    salt: { type: String, required: true },
    hash: { type: String, required: true }
});

mongoose.model('User', User);