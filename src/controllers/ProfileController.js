const User = require("../models/User")

class ProfileController {
    // [GET] /profile
    index(req, res) {
        if (req.session.user) {
            const userProfile = req.session.user;
            res.json({ user : userProfile })
        } else {
            res.redirect('/login')
        }

    }

}

module.exports = new ProfileController