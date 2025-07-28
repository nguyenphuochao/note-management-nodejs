const NoteController = require('../controllers/NoteController')
const LoginController = require('../controllers/LoginController')
const RegisterController = require('../controllers/RegisterController')
const ProfileController = require('../controllers/ProfileController')
const authenticateUser = require('../middlewares/authenticateUser')


module.exports = function route(router) {
    // login
    router.get('/login', LoginController.index)
    router.post('/login', LoginController.login)
    router.post('/logout', LoginController.logout)

    // register
    router.get('/register', RegisterController.index)
    router.post('/register', RegisterController.register)

    // rediect default
    router.get('/', function (req, res) {
        res.redirect('/notes')
    })

    // middleware authenticateUser
    router.use(authenticateUser);

    // profile
    router.get('/profile', ProfileController.index)

    // notes
    router.get('/notes', NoteController.index)
    router.get('/notes/create', NoteController.create)
    router.post('/notes/store', NoteController.store)
    router.get('/notes/:id/edit', NoteController.edit)
    router.put('/notes/:id', NoteController.update)
    router.delete('/notes/:id', NoteController.destroy)
    router.post('/notes/:id/copy', NoteController.copy)
    router.get('/notes/trash', NoteController.trash)
    router.delete('/notes/:id/forceDelete', NoteController.forceDelete)
    router.patch('/notes/:id/restore', NoteController.restore)
    router.get('/notes/sort', NoteController.sortList)
    router.patch('/notes/sort/update', NoteController.sortUpdate)
    router.get('/notes/bookmark', NoteController.bookmarkList)
    router.patch('/notes/:id/bookmark', NoteController.bookmarkUpdate)
    router.patch('/notes/:id/bookmark/uncheck', NoteController.bookmarkUncheck)
    router.post('/notes/handle-form-actions', NoteController.handleFormActions)
}
