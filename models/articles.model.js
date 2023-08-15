const db = require('../db/connection.js');

exports.returnAllArticles = () => {
    const articlesQuery = 'SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;'
    return db.query(articlesQuery).then(({ rows }) => {
        rows.forEach((article) => {
            delete article.body
            +article.comment_count 
        })
        return rows
    })
}

exports.returnArticle = (article_id) => {
    article_id = Number(article_id)
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "Not Found" })
        else return rows
    })
}