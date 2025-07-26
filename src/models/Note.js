const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;


const Note = new Schema({
    name: { type: String, maxLength: 255 },
    description: { type: String, Text: true },
    userId: { type: String, maxLength: 255 },
    bookmark: { type: Number },
    sort_num: { type: Number },
}, { timestamps: true });

Note.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: 'all'
});

module.exports = mongoose.model('Note', Note);