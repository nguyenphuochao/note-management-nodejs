const User = require('../models/User')

class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('login/index', { layout: 'default' })
    }

    // [POST] /login
    login(req, res) {
        const user = User.findOne({ username: req.body.username })
            .then(user => {
                if (!user) return res.json({ message: 'User not found' })
                const result = req.body.password === user.password
                if (!result) return res.json({ message: 'Password invalid' })
                // set session user
                req.session.user = {
                    id: user._id,
                    username: user.username,
                    fullname: user.fullname
                };
                res.redirect('/')
            })
            .catch(err => console.log(err))
    }

    // [POST] /logout
    logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

module.exports = new LoginController