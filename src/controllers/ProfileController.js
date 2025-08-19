const User = require("../models/User")
const path = require('path');
class ProfileController {
    // [GET] /profile
    index(req, res) {
        res.render('profile/index', { user: req.session.user })
    }

    // [PUT] /profile/update
    update(req, res) {
        const dataUser = {
            fullname: req.body.fullname,
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
        }else {
            dataUser.avatar = null
            req.session.user.avatar = null
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