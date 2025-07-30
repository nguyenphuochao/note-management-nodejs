const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const App = new Schema({
    is_show_desc: { type: Number },
    is_show_bookmark: { type: Number },
    is_show_created_at: { type: Number },
    is_show_updated_at: { type: Number },
    userId: { type: String, maxLength: 255 },
}, { timestamps: true });

module.exports = mongoose.model('App', App);