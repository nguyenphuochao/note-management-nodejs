class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('login/index', { layout: 'default' })
    }

    // [POST] /login
    login(req, res) {
        res.json(req.body)
    }

    // [POST] /logout
    logout(req, res) {
        res.json(req.body)
    }
}

module.exports = new LoginController