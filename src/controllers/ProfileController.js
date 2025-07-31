const User = require("../models/User")

class ProfileController {
    // [GET] /profile
    index(req, res) {
        if (req.session.user) {
            const usrerProfile = req.session.user;
            res.render('profile/index', { user: usrerProfile })
        } else {
            res.redirect('/login')
        }
    }

    // [PUT] /profile/update
    update(req, res) {
        const dataUser = {
            fullname: req.body.fullname,
            avatar: req.body.avatar
        }

        User.updateOne({ _id: req.session.user.id }, dataUser)
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Đã cập nhật thông tin tài khoản'
                }

                // set new fullname
                req.session.user.fullname = req.body.fullname

                res.redirect('/profile')
            })
            .catch(err => console.log(err))
    }

}

module.exports = new ProfileController