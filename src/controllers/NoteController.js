const Note = require('../models/Note')
const { mutipleMongooseToObject, mongooseToObject } = require('../util/mongoose')

class NoteController {
    // [GET] /note/index
    index(req, res, next) {
        // show form search
        let is_dislay_search = false

        // pagination
        const page = parseInt(req.query.page) || 1 // current page
        const limit = parseInt(req.query["show-count"]) || 10; // limit data
        const skipIndex = (page - 1) * limit; // offset index

        let searchQuery = Note.find({ userId: req.session.user.id }) // query data model

        // search query
        const s_name = req.query.s_name
        const s_desc = req.query.s_desc
        const s_createdAtFrom = req.query.s_createdAtFrom
        const s_createdAtTo = req.query.s_createdAtTo
        const s_updatedAtFrom = req.query.s_updatedAtFrom
        const s_updatedAtTo = req.query.s_updatedAtTo

        // search name
        if (Object.hasOwn(req.query, 's_name') && s_name != '') {
            is_dislay_search = true
            searchQuery = searchQuery.find({
                name: new RegExp(s_name, "i")
            })
        }

        // search description
        if (Object.hasOwn(req.query, 's_desc') && s_desc != '') {
            is_dislay_search = true
            searchQuery = searchQuery.find({
                description: new RegExp(s_desc, "i")
            })
        }

        // search createdAt from
        if (Object.hasOwn(req.query, 's_createdAtFrom') && s_createdAtFrom != '') {
            is_dislay_search = true
            const createdAtFrom = new Date(s_createdAtFrom + 'T00:00:00.000Z').toISOString()
            searchQuery = searchQuery.find({
                createdAt: { $gte: createdAtFrom }
            })
        }

        // search createdAt to
        if (Object.hasOwn(req.query, 's_createdAtTo') && s_createdAtTo != '') {
            is_dislay_search = true
            const createdAtTo = new Date(s_createdAtTo + 'T23:59:59.000Z').toISOString()
            searchQuery = searchQuery.find({
                createdAt: { $lte: createdAtTo }
            })
        }

        // search updatedAt from
        if (Object.hasOwn(req.query, 's_updatedAtFrom') && s_updatedAtFrom != '') {
            is_dislay_search = true
            const updateAtFrom = new Date(s_updatedAtFrom + 'T00:00:00.000Z').toISOString()
            searchQuery = searchQuery.find({
                updatedAt: { $gte: updateAtFrom }
            })
        }

        // search updatedAt to
        if (Object.hasOwn(req.query, 's_updatedAtTo') && s_updatedAtTo != '') {
            is_dislay_search = true
            const updatedAtTo = new Date(s_updatedAtTo + 'T23:59:59.000Z').toISOString()
            searchQuery = searchQuery.find({
                updatedAt: { $lte: updatedAtTo }
            })
        }

        Promise.all([
            Note.find(searchQuery).countDocuments({ userId: req.session.user.id }),
            searchQuery.skip(skipIndex).limit(limit),
            Note.countDocumentsWithDeleted({ userId: req.session.user.id, deleted: true })
        ])
            .then(([totalItems, notes, totalDeleted]) =>
                res.render('notes/index', {
                    notes: mutipleMongooseToObject(notes),
                    s_name,
                    s_desc,
                    is_dislay_search: is_dislay_search ? 'block' : 'none',
                    s_createdAtFrom,
                    s_createdAtTo,
                    s_updatedAtFrom,
                    s_updatedAtTo,
                    totalItems,
                    totalPage: Math.ceil(totalItems / limit),
                    limit,
                    page,
                    totalDeleted
                })
            )
            .catch(next)
    }

    // [GET] /note/create
    create(req, res) {
        res.render('notes/create')
    }

    // [POST] /note/store
    store(req, res) {
        const formData = {
            name: req.body.name,
            description: req.body.description,
            userId: req.session.user.id,
            bookmark: 0,
        }
        const note = new Note(formData)
        note.save()
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Create note successfully'
                }

                res.redirect('/notes')
            })
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
        Note.delete({ _id: req.params.id })
            .then(() => res.redirect('/notes'))
            .catch(err => console.log(err))
    }

    // [POST] /notes/copy
    copy(req, res, next) {
        Note.findById(req.params.id)
            .then(note => {
                const noteData = new Note({
                    name: note.name,
                    description: note.description,
                    userId: req.session.user.id
                })
                noteData.save()
                    .then(() => res.redirect('/notes'))
                    .catch(err => console.log(err))
            })
            .catch(next)
    }

    // [PATCH] /notes/:id/bookmark
    bookmark(req, res) {
        Note.updateOne({ _id: req.params.id }, { bookmark: req.body.bookmark })
            .then(() => res.json({
                status: "OK"
            }))
            .catch(err => console.log(err))
    }

    // [GET] /notes/trash
    trash(req, res) {
        Note.findWithDeleted({ deleted: true })
            .then(notes => res.render('notes/trash', { notes: mutipleMongooseToObject(notes) }))
            .catch(err => console.log(err))
    }

    // [DELETE] /notes/:id/forceDelete
    forceDelete(req, res) {
        Note.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/notes/trash'))
            .catch(err => console.log(err))
    }

    // [PATCH] /notes/:id/restore
    restore(req, res) {
        Note.restore({ _id: req.params.id })
            .then(() => res.redirect('/notes/trash'))
            .catch(err => console.log(err))
    }

    // [GET] /notes/sort
    sortList(req, res, next) {
        Note.find({ userId: req.session.user.id })
            .then(notes => res.render('notes/sort', { notes: mutipleMongooseToObject(notes) }))
            .catch(next)
    }

    sortUpdate(req, res, next) {

    }

    bookmarkList(req, res, next) {
        Note.find({ userId: req.session.user.id, bookmark: 1 })
            .then(notes => res.render('notes/bookmark', { notes: mutipleMongooseToObject(notes) }))
            .catch(next)
    }
}

module.exports = new NoteController