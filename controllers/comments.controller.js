const {returnAllCommentsByArticleId, addNewCommentByArticleIdToDatabase, deleteCommentFromDatabase} = require('../models/comments.model.js')

exports.getAllCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    returnAllCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments:comments})
    }).catch((err) => {
        next(err)
    })
}

//nc-news-7

exports.postNewCommentByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    addNewCommentByArticleIdToDatabase(article_id, username, body).then((rows) => {
        res.status(201).send(rows[0])
    }).catch((err) => {
        next(err)        
    })
}

exports.deleteCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    deleteCommentFromDatabase(comment_id).then(() => {
        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}
