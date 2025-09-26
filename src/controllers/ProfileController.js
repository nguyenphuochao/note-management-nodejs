const User = require("../models/User")
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class ProfileController {
    // [GET] /profile
    index(req, res) {
        res.render('profile/index', { user: req.session.user })
    }

    // [PUT] /profile/update
    async update(req, res) {

        try {
            const user = await User.findOne({ email: req.session.user.email })
            const dataUser = {
                fullname: req.body.fullname,
            }
            const passwordDB = user.password
            const passwordCurrent = req.body.current_password
            const passwordNew = req.body.new_password
            const resultComparePassword = bcrypt.compareSync(passwordCurrent, passwordDB);

            if (passwordCurrent && !resultComparePassword) {
                // use session alert
                req.session.message = {
                    type: 'danger',
                    title: 'Tài khoản hiện tại chưa chính xác'
                }
                return res.redirect('/profile')
            }

            if (req.body.new_password !== req.body.confirm_password) {
                // use session alert
                req.session.message = {
                    type: 'danger',
                    title: 'Mật khẩu xác nhập lại chưa khớp'
                }
                return res.redirect('/profile')
            }

            if (passwordNew.length < 6) {
                // use session alert
                req.session.message = {
                    type: 'danger',
                    title: 'Mật khẩu mới phải 6 chữ số'
                }
                return res.redirect('/profile')
            }

            if (req.files) {
                // Get the file that was set to our field named "image"
                const { avatar } = req.files;
                // If no image submitted, exit
                if (!avatar) return res.sendStatus(400);
                // Save avatar name in DB
                dataUser.avatar = avatar.name
                // Move the uploaded image to our upload folder
                avatar.mv(path.join(__dirname, "../", "public/uploads/" + avatar.name));
                // set new avatar
                req.session.user.avatar = avatar.name
            }

            if (passwordNew) {
                dataUser.password = bcrypt.hashSync(passwordNew, saltRounds)
            }

            await User.updateOne({ _id: req.session.user.id }, dataUser)
            req.session.message = {
                type: 'success',
                title: 'Đã cập nhật thông tin tài khoản'
            }

            // set new fullname
            req.session.user.fullname = req.body.fullname

            res.redirect('/profile')

        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = new ProfileController