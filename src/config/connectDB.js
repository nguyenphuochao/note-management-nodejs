const mongoose = require('mongoose');

async function connectDB() {
    try {
        // await mongoose.connect('mongodb://localhost:27017/note_management_dev');
        await mongoose.connect('mongodb+srv://nguyenphuochao456:ZuvCPHE5KnQoZ9a4@cluster0.myinnsw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connect successfully');
    } catch (error) {
        console.log('Connect failed');
    }
}

module.exports = { connectDB };