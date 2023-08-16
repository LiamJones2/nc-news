const {returnAllCommentsByArticleId, addNewCommentByArticleIdToDatabase, updateCommentVotesByCommentId} = require('../models/comments.model.js')

exports.getAllCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    returnAllCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send(comments)
    }).catch((err) => {
        next(err)
    })
}

//nc-news-6
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
