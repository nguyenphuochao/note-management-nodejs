const User = require("../models/User")

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
            password: req.body.password

        }
        const user = new User(userData)
        user.save()
            .then(() => res.redirect('/notes'))
            .catch(err => console.log(err))
    }
}

module.exports = new RegisterController