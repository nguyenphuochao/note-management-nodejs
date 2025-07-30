const mongoose = require('mongoose');

async function connectDB() {
    try {
        // await mongoose.connect('mongodb://localhost:27017/note_management_dev');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failed');
    }
}

module.exports = { connectDB };