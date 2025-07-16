const express = require('express')
const path = require('path');
const { engine } =  require('express-handlebars')
const app = express()

// connect db
const db = require('./config/connectDB')
// route
const route = require('./routes')

// view engine handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

db.connectDB() // kết nối DB

app.use(express.static(path.join(__dirname, 'public')));

const port = 3000

const NoteController = require('./controllers/NoteController')

app.get('/', function (req, res) {
    res.redirect('/notes')
});

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
