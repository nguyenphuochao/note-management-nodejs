const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
                    return res.json({
                        status_code: 401,
                        message: 'Thông tin tài khoản hoặc mật khẩu không hợp lệ'
                    })
                }

                const result = bcrypt.compareSync(req.body.password, user.password);
                if (!result) {
                    return res.json({ 
                        status_code: 401,
                        message: 'Thông tin tài khoản hoặc mật khẩu không hợp lệ' 
                    })
                }
                
                // set session user
                req.session.user = {
                    id: user._id,
                    email: user.email,
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