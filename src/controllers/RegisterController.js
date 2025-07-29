const Note = require("../models/Note");
const User = require("../models/User")
const bcrypt = require('bcrypt');
const saltRounds = 10;

class RegisterController {
    // [GET] /resgister
    index(req, res) {
        res.render('register/index', { layout: 'default' })
    }

    // [POST] /register
    register(req, res) {
        User.countDocuments({ email: req.body.email })
            .then(user => {
                // validate
                if (user > 0) {
                    // use session alert
                    req.session.message = {
                        type: 'danger',
                        title: 'Email đã tồn tại. Vui lòng thử email khác'
                    }
                    return res.redirect('/register')
                }

                const userData = {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, saltRounds)
                }

                const createUser = new User(userData)

                createUser.save()
                    .then(() => res.redirect('/login'))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }

    // [GET] /check-email-exist
    checkEmailExist(req, res) {
        res.send("true")
    }
}

module.exports = new RegisterController