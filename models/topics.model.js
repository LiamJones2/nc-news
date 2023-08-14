const db = require('../db/connection.js');

exports.returnTopics = () => {
    return db.query('SELECT * FROM topics').then(({rows}) => {
        return rows
    })
    .catch((err) => {
        throw err
    })
}