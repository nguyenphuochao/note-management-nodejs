const NoteController = require('../controllers/NoteController')
const LoginController = require('../controllers/LoginController')
const RegisterController = require('../controllers/RegisterController')
const ProfileController = require('../controllers/ProfileController')

module.exports = function route(app) {
    // rediect default
    app.get('/', function (req, res) {
        res.redirect('/notes')
    })

    // login
    app.get('/login', LoginController.index)
    app.post('/login', LoginController.login)
    app.post('/logout', LoginController.logout)

    // register
    app.get('/register', RegisterController.index)
    app.post('/register', RegisterController.register)

    // profile
    app.get('/profile', ProfileController.index)

    // notes
    app.get('/notes', NoteController.index)
    app.get('/notes/create', NoteController.create)
    app.post('/notes/store', NoteController.store)
    app.get('/notes/:id/edit', NoteController.edit)
    app.put('/notes/:id', NoteController.update)
    app.delete('/notes/:id', NoteController.destroy)
    app.post('/notes/:id/copy', NoteController.copy)
    app.patch('/notes/:id/bookmark', NoteController.bookmark)
    app.get('/notes/trash', NoteController.trash)

    // categories
}
