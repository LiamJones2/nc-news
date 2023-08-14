const endpoints = require('../endpoints.json')

exports.returnEndpoints = (req, res, next) => {
    res.status(200).send(endpoints)
}