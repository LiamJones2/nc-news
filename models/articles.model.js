const db = require('../db/connection.js');

exports.returnArticle = (article_id) => {
    article_id = Number(article_id)
    return db.query('SELECT * FROM articles WHERE article_id = $1',[article_id]).then(({rows}) => {
        return rows
    })
}