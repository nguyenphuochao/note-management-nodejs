const NoteController = require('../controllers/NoteController')
const LoginController = require('../controllers/LoginController')
const RegisterController = require('../controllers/RegisterController')
const ProfileController = require('../controllers/ProfileController')
const AppController = require('../controllers/AppController')
const authenticateUser = require('../middlewares/authenticateUser')

const multer = require('multer');

// Cấu hình nơi lưu trữ file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'uploads')); // lưu vào public/uploads
    },
    filename: function (req, file, cb) {
        // Đặt tên file duy nhất bằng timestamp + original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


module.exports = function route(router) {
    // login
    router.get('/login', LoginController.index)
    router.post('/login', LoginController.login)
    router.post('/logout', LoginController.logout)

    // register
    router.get('/register', RegisterController.index)
    router.post('/register', RegisterController.register)
    router.get('/check-email-exist', RegisterController.checkEmailExist)

    // rediect default
    router.get('/', function (req, res) {
        res.redirect('/notes')
    })

    // middleware authenticateUser
    router.use(authenticateUser);

    // profile
    router.get('/profile', ProfileController.index)
    router.put('/profile', upload.single('file'), ProfileController.update)

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

    // apps
    router.put('/apps/:id', AppController.update)
}
