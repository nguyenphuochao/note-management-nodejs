const Note = require('../models/Note')
const { mutipleMongooseToObject } = require('../util/mongoose')

class NoteController {
    // [GET] /note/index
    index(req, res, next) {
        Note.find({})
            .then(notes => {
                res.render('notes/index', {
                    notes: mutipleMongooseToObject(notes)
                })
            })
            .catch(next)
    }

    // [GET] /note/create
    create(req, res) {
        res.render('notes/create')
    }

    // [POST] /note/store
    store(req, res) {
        const note = new Note(req.body)
        note.save()
            .then(() => res.redirect('/notes'))
            .catch(err => console.log(err))
    }

    // [GET] /note/edit
    edit(req, res) {
        res.send('edit')
    }

    // [PUT] /note/update
    update(req, res) {
        res.send('update')
    }

    // [DELETE] /note/destroy
    destroy(req, res) {
        res.send('destroy')
    }
}

module.exports = new NoteController