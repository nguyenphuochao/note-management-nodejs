const express = require('express')
const path = require('path');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars')
var paginate = require('handlebars-paginate');
const app = express()

const db = require('./config/connectDB')
const route = require('./routes');

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
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

db.connectDB() // connect DB

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
})); // support POST Form
app.use(express.json()); // support JSON : ajax, fetch, axios, XMLHttpRequest

// HTTP method override
app.use(methodOverride('_method'));

const port = 3000

route(app) // router

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
