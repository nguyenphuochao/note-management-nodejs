const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/note_management_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failed');
    }
}

module.exports = { connectDB };