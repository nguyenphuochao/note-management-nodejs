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
        const userData = {
            fullname: req.body.fullname,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, saltRounds)
        }
        const user = new User(userData)
        user.save()
            .then(() => res.redirect('/login'))
            .catch(err => console.log(err))
    }
}

module.exports = new RegisterController