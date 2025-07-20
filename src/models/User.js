const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    fullname: { type: String, maxLength: 255 },
    username: { type: String, maxLength: 255 },
    password: { type: String, maxLength: 255 },
}, { timestamps: true });

module.exports = mongoose.model('User', User);