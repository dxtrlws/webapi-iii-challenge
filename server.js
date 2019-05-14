const express = require('express');
const usersRouter = require('./users/userRouter');
const server = express();
server.use(express.json());

// Routes
server.use('/api/users', usersRouter);

// Middleware
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} ${req.path} ${Date.now()}`);
  next();
}

module.exports = server;
