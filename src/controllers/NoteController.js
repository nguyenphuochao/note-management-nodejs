const App = require('../models/App');
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

        // sort column
        if (req.query.hasOwnProperty('_sort')) {
            searchQuery.sort({
                [req.query.column]: req.query.type
            })
        }

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
            searchQuery.skip(skipIndex).limit(limit).sort({ sort_num: 'asc' }),
            Note.countDocumentsWithDeleted({ userId: req.session.user.id, deleted: true }),
            Note.countDocuments({ userId: req.session.user.id, bookmark: 1 }),
            App.findOne({ userId: req.session.user.id })
        ])
            .then(([totalItems, notes, totalDeleted, totalBookmark, app]) =>
                res.render('notes/index', {
                    notes: mutipleMongooseToObject(notes),
                    s_name,
                    s_desc,
                    is_dislay_search,
                    s_createdAtFrom,
                    s_createdAtTo,
                    s_updatedAtFrom,
                    s_updatedAtTo,
                    totalItems,
                    totalPage: Math.ceil(totalItems / limit),
                    limit,
                    page,
                    totalDeleted,
                    totalBookmark,
                    app_id: app._id,
                    is_show_desc: app.is_show_desc,
                    is_show_bookmark: app.is_show_bookmark,
                    is_show_created_at: app.is_show_created_at,
                    is_show_updated_at: app.is_show_updated_at
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
        Note.find({ userId: req.session.user.id }).countDocuments().then(totalNote => {
            const formData = {
                name: req.body.name,
                description: req.body.description,
                userId: req.session.user.id,
                bookmark: 0,
                sort_num: totalNote + 1
            }
            const note = new Note(formData)
            note.save()
                .then(() => {
                    // use session alert
                    req.session.message = {
                        type: 'success',
                        title: 'Đã thêm mới ghi chú'
                    }

                    res.redirect('/notes')
                })
                .catch(err => console.log(err))
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
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Đã cập nhật ghi chú'
                }
                res.redirect('/notes')
            })
            .catch(err => console.log(err))
    }

    // [DELETE] /note/destroy
    destroy(req, res) {
        Note.delete({ _id: req.params.id })
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Đã xóa ghi chú'
                }
                res.redirect('/notes')
            })
            .catch(err => console.log(err))
    }

    // [POST] /notes/copy
    copy(req, res, next) {

        Promise.all([
            Note.find({ userId: req.session.user.id }).countDocuments(),
            Note.findById(req.params.id)
        ])
            .then(([totalNote, note]) => {
                const noteData = new Note({
                    name: note.name,
                    description: note.description,
                    userId: req.session.user.id,
                    bookmark: 0,
                    sort_num: totalNote + 1
                })
                const noteItem = new Note(noteData)
                noteItem.save()
                    .then(() => {
                        req.session.message = {
                            type: 'success',
                            title: 'Đã copy ghi chú'
                        }
                        res.redirect('/notes')
                    })
                    .catch(next)
            })
            .catch(next)
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
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Đã khôi phục ghi chú'
                }
                res.redirect('/notes/trash')
            })
            .catch(err => console.log(err))
    }

    // [GET] /notes/sort
    sortList(req, res, next) {
        Note.find({ userId: req.session.user.id }).sort({ sort_num: 'asc' })
            .then(notes => res.render('notes/sort', { notes: mutipleMongooseToObject(notes) }))
            .catch(next)
    }

    // [PATCH] /notes/sort/update
    sortUpdate(req, res, next) {
        var sort_num = 1;
        var noteIds = (req.body.ids).toString().split(",")
        for (let i = 0; i < noteIds.length; i++) {
            Note.updateOne({ _id: noteIds[i] }, {
                sort_num: sort_num++
            })
                .then(() => {
                    // use session alert
                    req.session.message = {
                        type: 'success',
                        title: 'Đã sắp xếp ghi chú'
                    }
                    res.redirect('/notes/sort')
                })
                .catch(err => console.log(err))
        }
    }

    // [GET] /notes/bookmark
    bookmarkList(req, res, next) {
        Promise.all([
            Note.find({ userId: req.session.user.id, bookmark: 1 }),
            Note.countDocuments({ userId: req.session.user.id, bookmark: 1 })
        ])
            .then(([notes, totalNote]) => {
                res.render('notes/bookmark',
                    {
                        notes: mutipleMongooseToObject(notes),
                        totalNote
                    }
                )
            })
            .catch(next)
    }

    // [PATCH] /notes/:id/bookmarkUpdate
    bookmarkUpdate(req, res) {
        Note.updateOne({ _id: req.params.id },
            {
                bookmark: Number(req.body.bookmark) == 1 ? 0 : 1
            })
            .then(() => {
                Promise.all([
                    Note.findOne({ _id: req.params.id, userId: req.session.user.id }),
                    Note.countDocuments({ bookmark: 1, userId: req.session.user.id })
                ])
                    .then(([
                        NoteItem,
                        totalBookmark
                    ]) => {
                        res.json({
                            bookmark: NoteItem.bookmark,
                            totalBookmark
                        })
                    })

            })
            .catch(err => console.log(err))
    }

    // [PATCH] /notes/:id/bookmarkUncheck
    bookmarkUncheck(req, res) {
        Note.updateOne({ _id: req.params.id }, { bookmark: 0 })
            .then(() => {
                // use session alert
                req.session.message = {
                    type: 'success',
                    title: 'Đã khôi phục ghi chú'
                }

                res.redirect('/notes/bookmark')
            })
            .catch(err => console.log(err))
    }

    // [POST] /notes/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Note.delete({ _id: { $in: req.body.noteIds } })
                    .then(() => {
                        // use session alert
                        req.session.message = {
                            type: 'success',
                            title: 'Đã xóa ghi chú'
                        }
                        res.redirect('/notes')
                    })
                    .catch(next)
                break;

            case 'bookmark':
                {
                    const newValues = { bookmark: 1 }
                    Note.updateMany(
                        { _id: { $in: req.body.noteIds } },
                        { $set: newValues }
                    )
                        .then(() => {
                            // use session alert
                            req.session.message = {
                                type: 'success',
                                title: 'Đã đánh dấu ghi chú'
                            }
                            res.redirect('/notes')
                        })
                        .catch(next)
                    break;
                }


            case 'unbookmark':
                {
                    const newValues = { bookmark: 0 }
                    Note.updateMany(
                        { _id: { $in: req.body.noteIds } },
                        { $set: newValues }
                    )
                        .then(() => {
                            // use session alert
                            req.session.message = {
                                type: 'success',
                                title: 'Đã hủy đánh dấu ghi chú'
                            }
                            res.redirect('/notes')
                        })
                        .catch(next)
                    break;
                }

            default:
                res.json({ message: 'Action is invalid' })
        }
    }
}

module.exports = new NoteController