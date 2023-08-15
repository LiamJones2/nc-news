const {returnAllArticles, returnArticle} = require('../models/articles.model.js')

exports.getAllArticles = (req, res, next) => {
    returnAllArticles().then((articles) => {
        res.status(200).send(articles)
    }).catch((err) => {
        next(err)
    })
}


exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    returnArticle(article_id).then((article) => {
        res.status(200).send({"article":article[0]})
    }).catch((err) => {
        next(err)
    })
}