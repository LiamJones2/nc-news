const {returnAllUsers, returnUserByUsername} = require('../models/users.model.js')

exports.getAllUsers = (req, res, next) => {
    returnAllUsers().then((users) => {
        res.status(200).send({users:users})
    }).catch((err) => {
        next(err)
    })
}

exports.getUser = (req, res, next) => {
    const {username} = req.params
    returnUserByUsername(username).then((user) => {
        res.status(200).send({user:user[0]})
    }).catch((err) => {
        next(err)
    })
}