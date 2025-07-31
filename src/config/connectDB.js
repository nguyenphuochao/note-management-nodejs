const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failed');
    }
}

module.exports = { connectDB };