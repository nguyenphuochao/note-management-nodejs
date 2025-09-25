const User = require('../models/User')
const bcrypt = require('bcrypt');

class LoginController {
    // [GET] /login
    index(req, res) {
        res.render('login/index', { layout: 'default' })
    }

    // [POST] /login
    login(req, res) {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    // use session alert
                    req.session.message = {
                        type: 'danger',
                        title: 'Thông tin tài khoản hoặc mật khẩu không hợp lệ'
                    }
                    return res.redirect('/login')
                }

                const result = bcrypt.compareSync(req.body.password, user.password);
                if (!result) {
                    // use session alert
                    req.session.message = {
                        type: 'danger',
                        title: 'Thông tin tài khoản hoặc mật khẩu không hợp lệ'
                    }
                    return res.redirect('/login')
                }

                // set session user
                req.session.user = {
                    id: user._id,
                    email: user.email,
                    fullname: user.fullname,
                    avatar: user.avatar,
                    password: user.password,
                    createdAt: user.createdAt
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