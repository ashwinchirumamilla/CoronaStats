const express = require('express');
const mysql = require('mysql');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'covid19'
}

const hostname = '127.0.0.1';
const port = 8080;
const index = require('./routes/index');

let app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(port, hostname, () => {
    console.log(`Listening on http://${hostname}:${port}`)
});

app.get('/', index.getHomePage);
app.post('/country', index.getCountryData);
const database = mysql.createConnection(dbConfig);

database.connect( (err) => {
    if (err) {
        throw err;
    }

    console.log(`Successfully connected to ${dbConfig.database} database`);
})

global.database = database; 