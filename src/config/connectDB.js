const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/note_management_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Kết nối thành công');
    } catch (error) {
        console.log('Kết nối thất bại');
    }
}

module.exports = { connectDB };