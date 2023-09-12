const express = require('express');
const app = express();
const { createServer } = require('http');
const { join } = require('path');

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

const server = createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
  });
  
  
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });
  
  // Store user socket information
  const users = {};
  
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      room = 113
      console.log(room)
      socket.join(room);
      users[socket.id] = room; 
      socket.broadcast.to(room).emit('user-connected', { userId: socket.id, message: 'New user has connected' });
    });
  
    socket.on('chat message', (msg) => {
      console.log(msg)
      const room = users[socket.id];
      io.to(room).emit('chat message', msg);
    });
  
    socket.on('disconnect', () => {
      const room = users[socket.id];
      socket.leave(room);
      delete users[socket.id];
    });
  });

  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

module.exports = app;