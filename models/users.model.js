const db = require('../db/connection.js');

exports.returnAllUsers = () => {
    return db.query('SELECT * FROM users').then(({rows}) => {
        return rows
    })
}

exports.returnUserByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1',[username]).then(({rows}) => {
        if(rows.length === 0) return Promise.reject({status:404, msg:"Username Not Found"})
        else return rows
    })
}