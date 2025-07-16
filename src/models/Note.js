const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Note = new Schema({
    name: { type: String, maxLength: 255 },
    description: { type: String, maxLength: 600 },
    categoryID: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Note', Note);