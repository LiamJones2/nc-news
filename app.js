const express = require('express');
const app = express();

const {getTopics} = require('./controllers/topics.controller.js')
const {getArticles} = require('./controllers/articles.controller.js')

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticles);

app.use((err, req, res, next) => {
    res.status(500).send({msg:"Server is unable to access data at the moment"})
})

module.exports = app;