const express = require('express')
const path = require('path');
const { engine } =  require('express-handlebars')
const app = express()

// connect db
const db = require('./config/connectDB')

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

// Notes
app.get('/notes', NoteController.index)
app.get('/notes/create', NoteController.create)
app.post('/notes/store', NoteController.store)
app.get('/notes/edit', NoteController.edit)
app.put('/notes/update', NoteController.update)
app.delete('/notes/destroy', NoteController.destroy)

// Categories

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
