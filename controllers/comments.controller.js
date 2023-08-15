const {returnAllCommentsByArticleId, addNewCommentByArticleIdToDatabase, updateCommentVotesByCommentId} = require('../models/comments.model.js')

exports.getAllCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    returnAllCommentsByArticleId(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch((err) => {
        next(err)
    })
}

exports.postNewCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    addNewCommentByArticleIdToDatabase(article_id, username, body).then((rows) => {
        res.status(201).send(rows[0])
    }).catch((err) => {
        next(err)
    })
}

exports.patchCommentVotesByCommentId = (req, res, next) => {
    const {article_id} = req.params
    addNewCommentByArticleIdToDatabase(article_id).then((rows) => {
        res.status(200).send(rows[0])
    }).catch((err) => {
        next(err)
    })
}
