const db = require('../db/connection.js');

exports.returnAllUsers = () => {
    return db.query('SELECT * FROM users').then(({rows}) => {
        return rows
    })
}