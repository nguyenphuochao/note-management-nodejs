class NoteController {
    // [GET] /note/index
    index(req, res) {
        res.render('notes/index')
    }

    // [GET] /note/create
    create(req, res) {
        res.send('create')
    }

    // [POST] /note/store
    store(req, res) {
        res.send('store')
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