const NoteController = require('../controllers/NoteController')
const LoginController = require('../controllers/LoginController')
const RegisterController = require('../controllers/RegisterController')

module.exports = function route(app) {
    // rediect default
    app.get('/', function(req, res) {
        res.rediect('/notes')
    })

    // login
    app.get('/login', LoginController.index)
    app.post('/login', LoginController.login)
    app.post('/logout', LoginController.logout)

    // register
    app.get('/register', RegisterController.index)
    app.post('/register', RegisterController.register)

    // notes
    app.get('/notes', NoteController.index)
    app.get('/notes/create', NoteController.create)
    app.post('/notes/store', NoteController.store)
    app.get('/notes/edit', NoteController.edit)
    app.put('/notes/update', NoteController.update)
    app.delete('/notes/destroy', NoteController.destroy)

    // categories
}
