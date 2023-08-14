const {returnArticle} = require('../models/articles.model.js')

exports.getArticles = (req, res, next) => {
    const {article_id} = req.params
    returnArticle(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch((err) => {
        next(err)
    })
}