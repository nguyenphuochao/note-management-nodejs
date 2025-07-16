class RegisterController {
    // [GET] /resgister
    index(req, res) {
        res.render('register/index')
    }

    // [POST] /register
    register(req, res) {
        res.json(req.body)
    }

}

module.exports = new RegisterController