const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Note = new Schema({
    name: { type: String, maxLength: 255 },
    description: { type: String, Text: true },
    userId: { type: String, maxLength: 255 },
    bookmark: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Note', Note);