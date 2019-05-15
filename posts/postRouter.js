const express = require('express');
const dbPosts = require('./postDb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await dbPosts.get();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Unable to process request' });
  }
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, async (req, res) => {
    try{
        const post = await dbPosts.remove(req.params.id)
        res.status(200).json({message: 'post has been removed', post})
    } catch(err) {
        res.status(500).json({ error: 'Unable to process request'})
    }
});

router.put('/:id', (req, res) => {});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;
    const posts = await dbPosts.getById(id);
    if (posts) {
      req.post = posts;
      next();
    } else {
      res.status(400).json({ message: 'Invalid post ID' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Unable to process request' });
  }
}

module.exports = router;
