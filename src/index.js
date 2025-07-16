const express = require('express')
const path = require('path');
const { engine } = require('express-handlebars')
const app = express()

const db = require('./config/connectDB') // connect db
const route = require('./routes') // get route
const vnFullFormat = require('./util/mongoose')

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

const port = 3000

route(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
