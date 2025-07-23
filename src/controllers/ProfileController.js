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

    // [POST] /profile/update
    update(req, res) {

    }

}

module.exports = new ProfileController