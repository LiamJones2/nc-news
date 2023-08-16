const {returnAllUsers} = require('../models/users.model.js')

exports.getAllUsers = (req, res, next) => {
    returnAllUsers().then((users) => {
        res.status(200).send({users:users})
    }).catch((err) => {
        next(err)
    })
}