const express = require('express');
const app = express();

const {returnEndpoints} = require('./controllers/app.controller.js')
const {getTopics} = require('./controllers/topics.controller.js')
const {getAllArticles, getArticle, patchVotesByArticleId} = require('./controllers/articles.controller.js')
const {getAllCommentsByArticleId, postNewCommentByArticleId, deleteCommentByCommentId} = require('./controllers/comments.controller.js')
const {getAllUsers} = require('./controllers/users.controller.js')


app.use(express.json());

app.get('/api', returnEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticle);

//nc-news-6
app.get('/api/articles/:article_id/comments', getAllCommentsByArticleId);

app.get('/api/users', getAllUsers)

app.post('/api/articles/:article_id/comments', postNewCommentByArticleId);

app.patch('/api/articles/:article_id', patchVotesByArticleId);

app.delete('/api/comments/:comment_id', deleteCommentByCommentId);

app.use((err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({msg:err.msg})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg:"Bad Request"})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg:"Server is unable to access data at the moment"})
})

module.exports = app;