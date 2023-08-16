const {returnAllArticles, returnArticle, updateArticleVotesInDatabase} = require('../models/articles.model.js')

exports.getAllArticles = (req, res, next) => {
    const {topic = null, sort_by = "created_at", order = "desc"} = req.query
    returnAllArticles(topic, sort_by, order).then((articles) => {
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

//nc-news-8
exports.patchVotesByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body

    updateArticleVotesInDatabase(article_id, inc_votes).then((rows) => {
        res.status(200).send(rows[0])
    }).catch((err) => {
        next(err)
        
    })
}
//nc-news-8