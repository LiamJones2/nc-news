const {returnTopics} = require('../models/topics.model.js')

exports.getTopics = (req, res, next) => {
    returnTopics().then((topics) => {
        res.status(200).send(topics)
    }).catch((err) => {
        next(err)
    })
}