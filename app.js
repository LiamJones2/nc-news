const express = require('express');
const app = express();

const {getTopics} = require('./controllers/topics.controller.js')

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    res.status(500).send({msg:"Server is unable to access data at the moment"})
})

module.exports = app;