const {returnAllArticles, returnArticle, updateArticleVotesInDatabase, addNewArticleToDatabase} = require('../models/articles.model.js')

exports.getAllArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query
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

exports.patchVotesByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleVotesInDatabase(article_id, inc_votes).then((rows) => {
        res.status(200).send(rows[0])
    }).catch((err) => {
        next(err)
    })
}

exports.postNewArticle = (req, res, next) => {
    const {author, title, body, topic, article_img_url} = req.body
    addNewArticleToDatabase(author, title, body, topic, article_img_url).then((article) => {
        res.status(201).send(article)
    }).catch((err) => {
        next(err)
    })
}