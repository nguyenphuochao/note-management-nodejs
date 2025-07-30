const express = require('express')
const path = require('path');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars')
const session = require('express-session');

const app = express()

const db = require('./config/connectDB')
const route = require('./routes');
const sortMiddleware = require('./middlewares/sortMiddleware');
const App = require('./models/App');

app.use(session({
    secret: 'your_secret_key', // A strong, unique secret for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save new but uninitialized sessions
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Set to true if using HTTPS in production
}));

// view engine handlebars
app.engine('handlebars', engine({
    helpers: {
        // vnFullFormat
        vnFullFormat: (datetime) => {
            const date = new Date(datetime);
            const vnFullFormat = date.toLocaleString("vi-VN", {
                weekday: "long", // show day
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            });
            return vnFullFormat
        },
        sum: (a, b) => {
            return a + b
        },
        subtract: (a, b) => {
            return a - b
        },
        pagination: (totalPages) => {
            var items = []
            for (var i = 1; i <= totalPages; i++) {
                items.push(i)
            }
            return items
        },
        active: (a, b) => {
            return a == b ? 'active' : ''
        },
        selected: (a, b) => {
            return a == b ? 'selected' : ''
        },
        prevPage: (page) => {
            return page <= 1 ? 'disabled' : ''
        },
        nextPage: (page, totalPage) => {
            return page >= totalPage ? 'disabled' : ''
        },
        bookmarkIcon: (bookmark) => {
            return bookmark == 1 ? 'fa-solid' : 'fa-regular'
        },
        displaySearch: (isDisplay) => {
            return isDisplay ? 'block' : 'none'
        },
        iconSearch: (isDisplay) => {
            return isDisplay ? 'fa-minus' : 'fa-plus'
        },
        sortable: (field, sort) => {
            const sortType = field === sort.column ? sort.type : 'default';

            const icons = {
                default: 'fa-solid fa-sort',
                asc: 'fa-solid fa-arrow-up',
                desc: 'fa-solid fa-arrow-down'
            };

            const types = {
                default: 'desc',
                asc: 'desc',
                desc: 'asc'
            };

            const icon = icons[sortType]
            const type = types[sortType]

            return `<a href="?_sort&column=${field}&type=${type}"><i class="${icon}"></i></a>`
        },
        showColumn: (isShow) => {
            return isShow ? '' : 'd-none'
        },
        checkedColumn: (isShow) => {
            return isShow ? 'checked' : ''
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

db.connectDB() // connect DB

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); // support POST Form
app.use(express.json()); // support JSON : ajax, fetch, axios, XMLHttpRequest

// HTTP method override
app.use(methodOverride('_method'));

app.use(sortMiddleware);

// use session global
app.use(function (req, res, next) {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

const port = 3000

route(app) // router

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
