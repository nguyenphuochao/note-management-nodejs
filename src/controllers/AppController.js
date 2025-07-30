const App = require("../models/App")

class AppController {
    // [PUT] /apps/:id
    update(req, res) {
        const appData = {
            is_show_desc: req.body.is_show_desc ? 1 : 0,
            is_show_bookmark: req.body.is_show_bookmark ? 1 : 0,
            is_show_created_at: req.body.is_show_created_at ? 1 : 0,
            is_show_updated_at: req.body.is_show_updated_at ? 1 : 0
        }

        App.updateOne({ _id: req.params.id }, appData)
            .then(() => {
                res.redirect('/')
            })
            .catch(err => console.log(err))
    }
}

module.exports = new AppController