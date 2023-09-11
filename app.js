const express = require('express');
const app = express();
const http = require("http")
const {Server} = require("socket.io")
const cors = require('cors');

const apiRouter = require('./routes/api-router.js');
const articlesRouter = require('./routes/articles-router.js');
const topicsRouter = require('./routes/topics-router.js');
const usersRouter = require('./routes/users-router.js');
const commentsRouter = require('./routes/comments-router.js');

app.use(express.json());

app.use(cors());

app.use('/api', apiRouter);

app.use('/api/articles', articlesRouter);

app.use('/api/topics', topicsRouter);

app.use('/api/users', usersRouter)

app.use('/api/comments', commentsRouter);


app.use((err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({msg:err.msg})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '22P02' || err.code === '23502' || err.msg === "Bad Request"){
        res.status(400).send({msg:"Bad Request"})
    }
    else{
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg:"Server is unable to access data at the moment"})
})

const activeUsers = new Map(); 

const io = require("socket.io")(8080, {
    cors: {
        origin: ["https://liamsnewsonline.netlify.app"],
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);

    activeUsers.set(socket.id, socket);


    io.emit("user-connected", socket.id);


    socket.on("send-message", (message) => {
        console.log(`Received message from ${socket.id}: ${message}`);

        io.emit("message", { sender: socket.id, message });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);

        activeUsers.delete(socket.id);

        io.emit("user-disconnected", socket.id);
    });
});

module.exports = app;