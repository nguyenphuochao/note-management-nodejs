const Note = require('../models/Note')
const { mutipleMongooseToObject } = require('../util/mongoose')

class NoteController {
    // [GET] /note/index
    index(req, res, next) {
        let is_dislay_search = false
        let searchQuery = Note.find({});
        const s_name = req.query.s_name
        const s_desc = req.query.s_desc
        const s_createdAtFrom = req.query.s_createdAtFrom
        const s_createdAtTo = req.query.s_createdAtTo
        const s_updatedAtFrom = req.query.s_updatedAtFrom
        const s_updatedAtTo = req.query.s_updatedAtTo

        if (s_name != undefined || s_desc != undefined) {
            is_dislay_search = true
        }

        if (Object.hasOwn(req.query, 's_name')) {
            searchQuery = searchQuery.find({
                name: new RegExp(s_name, "i")
            })
        }

        if (Object.hasOwn(req.query, 's_desc')) {
            searchQuery = searchQuery.find({
                description: new RegExp(s_desc, "i")
            })
        }

        if (Object.hasOwn(req.query, 's_createdAtFrom') && s_createdAtFrom != '') {
            const createdAtFrom = new Date(s_createdAtFrom + 'T00:00:00.000Z').toISOString()
            searchQuery = searchQuery.find({
                createdAt: { $gte: createdAtFrom }
            })
        }

        if (Object.hasOwn(req.query, 's_createdAtTo') && s_createdAtTo != '') {
            const createdAtTo = new Date(s_createdAtTo + 'T00:00:00.000Z').toISOString()
            console.log(createdAtTo >= "2025-07-16T12:38:38.395+00:00");
            searchQuery = searchQuery.find({
                createdAt: { $lte: createdAtTo }
            })
        }

        searchQuery
            .then(notes => {
                res.render('notes/index', {
                    notes: mutipleMongooseToObject(notes),
                    s_name,
                    s_desc,
                    is_dislay_search: is_dislay_search ? 'block' : 'none',
                    s_createdAtFrom,
                    s_createdAtTo,
                    s_updatedAtFrom,
                    s_updatedAtTo
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