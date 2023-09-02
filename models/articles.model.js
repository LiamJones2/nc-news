const db = require('../db/connection.js');

exports.returnAllArticles = (topic = null, sort_by = "created_at", order = "desc") => {
    let articlesQuery = 'SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id'

    if (topic !== null) articlesQuery += ' WHERE topic = $1'
    articlesQuery += ' GROUP BY articles.article_id'

    const acceptableSort_By = ["title", "topic", "author", "body", "created_at", "article_img_url", "comment_count", "votes"]
    if (!acceptableSort_By.includes(sort_by)) return Promise.reject({ status: 404, msg: "Incorrect sort_by" })
    else {
        articlesQuery += ` ORDER BY ${sort_by}`
    }
    const acceptableOrder = ["asc", "desc"]
    if (!acceptableOrder.includes(order.toLowerCase())) return Promise.reject({ status: 404, msg: "Incorrect order" })
    else {
        articlesQuery += ` ${order};`
    }

    const topicArray = topic !== null ? [topic] : [];
    return db.query(articlesQuery, topicArray).then(({ rows }) => {
        rows.forEach((article) => {
            delete article.body
            article.comment_count = +article.comment_count
        })
        return rows
    })
}

exports.returnArticle = (article_id) => {
    article_id = Number(article_id)
    return db.query('SELECT articles.*, COUNT(comments.comment_id) as comment_count FROM articles LEFT JOIN comments ON comments.article_id = $1 WHERE articles.article_id = $1 GROUP BY articles.article_id;', [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: "Not Found" })
            else return rows
        })
}

exports.updateArticleVotesInDatabase = (article_id, inc_votes) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: "Article Not Found" })
            else {
                const newVotes = rows[0].votes + inc_votes
                return db.query('UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;', [newVotes, article_id])
                    .then(({ rows }) => {
                        return rows;
                    })
            }
        })
}

exports.addNewArticleToDatabase = (author, title, body, topic, article_img_url) => {
    if (author === undefined || title === undefined|| body === undefined || topic === undefined) throw { msg : 'Bad Request' }

    const checkAuthorExists = db.query('SELECT * FROM users WHERE username = $1', [author])
    const checkTopicExists = db.query('SELECT * FROM topics WHERE slug = $1', [topic])

    return Promise.all([checkAuthorExists, checkTopicExists])
        .then((authorAndTopic) => {
            if (authorAndTopic[0].rows.length === 0) return Promise.reject({ status: 404, msg: "Author Not Found" })
            if (authorAndTopic[1].rows.length === 0) return Promise.reject({ status: 404, msg: "Topic Not Found" })
            else {
                const queryParams = [author, title, body, topic];
                let query = 'INSERT INTO articles (author, title, body, topic, article_img_url)';
                if (article_img_url) {
                    query += ' VALUES ($1, $2, $3, $4, $5) RETURNING *;';
                    queryParams.push(article_img_url);
                } else {
                    query += ' VALUES ($1, $2, $3, $4, DEFAULT) RETURNING *;';
                }
                return db.query(query, queryParams)
                    .then(({ rows }) => {
                        rows[0].comment_count = 0
                        return rows[0];
                    })
            }
        })
}