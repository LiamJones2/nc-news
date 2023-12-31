const db = require('../db/connection.js');



exports.returnAllCommentsByArticleId = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id]).then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "Article Not Found" })
        else {
            return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id]).then(({ rows }) => {
                return rows
            })
        }
    })
}


exports.addNewCommentByArticleIdToDatabase = (article_id, username, body) => {
    if (username === undefined || body === undefined) return Promise.reject({ status: 400, msg: "Bad Request" })
    const checkForArticle = db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    const checkForUsername = db.query('SELECT * FROM users WHERE username = $1', [username])
    return Promise.all([checkForArticle, checkForUsername])
        .then((articleAndUsername) => {
            if (articleAndUsername[0].rows.length === 0) return Promise.reject({ status: 404, msg: "Article Not Found" })
            if (articleAndUsername[1].rows.length === 0) return Promise.reject({ status: 404, msg: "Username Not Found" })

            else {
                return db.query('INSERT INTO comments (body, article_id, author, votes, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *;', [body, article_id, username, 0])
                    .then(({ rows }) => {
                        return rows;

                    })
            }
        })
}


exports.deleteCommentFromDatabase = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
        .then(({ rowCount }) => {
            if (rowCount === 0) return Promise.reject({ status: 404, msg: "Comment Not Found" })
            return
        })
}

exports.updateCommentVote = (comment_id, inc_votes) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id])
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: "Comment Not Found" })
            else {
                const newVotes = rows[0].votes + inc_votes
                return db.query('UPDATE comments SET votes = $2 WHERE comment_id = $1 RETURNING *;', [comment_id,newVotes]).then(({ rows }) => {
                    return rows
                })
            }
        })
}


