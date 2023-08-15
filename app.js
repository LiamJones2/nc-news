const express = require('express');
const app = express();

const {returnEndpoints} = require('./controllers/app.controller.js')
const {getTopics} = require('./controllers/topics.controller.js')
const {getAllArticles, getArticle} = require('./controllers/articles.controller.js')


app.get('/api', returnEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id', getArticle);

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