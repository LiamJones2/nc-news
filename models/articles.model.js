const db = require('../db/connection.js');

exports.returnAllArticles = () => {
    const articlesQuery = db.query('SELECT *, SUM(article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comment.article_id GROUP BY article_id')

    return db.query(articlesQuery).then(({ rows }) => {
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