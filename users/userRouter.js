const express = require('express');
const dbUsers = require('./userDb');
const dbPosts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, async (req, res) => {
  try {
    const user = await dbUsers.insert(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'unable to process request' });
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const newPost = await { user_id: req.user.id, text: req.body.text };
    const posts = await dbPosts.insert(newPost);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Unable to process request ' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await dbUsers.get();
    res.status(200).json(users);
  } catch (err) {
    res.send(500).json({ message: 'Unable to get users' });
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const posts = await dbUsers.getUserPosts(req.user.id);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'unable to process request' });
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const user = await dbUsers.remove(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'unable to remove user' });
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    const user = await dbUsers.update(req.user.id, req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'unable to update user at this time' });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  //   console.log(user);
  try {
    const user = await dbUsers.getById(req.params.id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: 'invalid user id' });
    }
  } catch (err) {
    res.status(500).json({ message: 'failed to process request' });
  }
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing required text field' });
  } else {
    next();
  }
}

module.exports = router;
