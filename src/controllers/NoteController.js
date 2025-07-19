const Note = require('../models/Note')
const { mutipleMongooseToObject, mongooseToObject } = require('../util/mongoose')

class NoteController {
    // [GET] /note/index
    index(req, res, next) {
        let is_dislay_search = false
        // pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query["show-count"]) || 10;
        const skipIndex = (page - 1) * limit;
        const totalPage = 1

        let searchQuery = Note.find({}).skip(skipIndex).limit(limit);

        // search query
        const s_name = req.query.s_name
        const s_desc = req.query.s_desc
        const s_createdAtFrom = req.query.s_createdAtFrom
        const s_createdAtTo = req.query.s_createdAtTo
        const s_updatedAtFrom = req.query.s_updatedAtFrom
        const s_updatedAtTo = req.query.s_updatedAtTo

        if (Object.hasOwn(req.query, 's_name') && s_name != '') {
            is_dislay_search = true
            searchQuery = searchQuery.find({
                name: new RegExp(s_name, "i")
            })
        }

        if (Object.hasOwn(req.query, 's_desc') && s_desc != '') {
            is_dislay_search = true
            searchQuery = searchQuery.find({
                description: new RegExp(s_desc, "i")
            })
        }

        if (Object.hasOwn(req.query, 's_createdAtFrom') && s_createdAtFrom != '') {
            is_dislay_search = true
            const createdAtFrom = new Date(s_createdAtFrom + 'T00:00:00.000Z').toISOString()
            searchQuery = searchQuery.find({
                createdAt: { $gte: createdAtFrom }
            })
        }

        if (Object.hasOwn(req.query, 's_createdAtTo') && s_createdAtTo != '') {
            is_dislay_search = true
            const createdAtTo = new Date(s_createdAtTo + 'T23:59:59.000Z').toISOString()
            searchQuery = searchQuery.find({
                createdAt: { $lte: createdAtTo }
            })
        }

        if (Object.hasOwn(req.query, 's_updatedAtFrom') && s_updatedAtFrom != '') {
            is_dislay_search = true
            const updateAtFrom = new Date(s_updatedAtFrom + 'T00:00:00.000Z').toISOString()
            searchQuery = searchQuery.find({
                updatedAt: { $gte: updateAtFrom }
            })
        }

        if (Object.hasOwn(req.query, 's_updatedAtTo') && s_updatedAtTo != '') {
            is_dislay_search = true
            const updatedAtTo = new Date(s_updatedAtTo + 'T23:59:59.000Z').toISOString()
            searchQuery = searchQuery.find({
                updatedAt: { $lte: updatedAtTo }
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
                    s_updatedAtTo,
                    totalPage,
                    limit
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
    edit(req, res, next) {
        const id = req.params.id;
        Note.findById(id)
            .then(note => res.render('notes/edit', { note: mongooseToObject(note) }))
            .catch(next)
    }

    // [PUT] /note/update
    update(req, res) {
        Note.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/notes'))
            .catch(err => console.log(err))
    }

    // [DELETE] /note/destroy
    destroy(req, res) {
        Note.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/notes'))
            .catch(err => console.log(err))
    }

    // [POST] /notes/copy
    copy(req, res, next) {
        Note.findById(req.params.id)
            .then(note => {
                const noteData = new Note({
                    name: note.name,
                    description: note.description
                })
                noteData.save()
                    .then(() => res.redirect('/notes'))
                    .catch(err => console.log(err))
            })
            .catch(next)
    }
}

module.exports = new NoteController