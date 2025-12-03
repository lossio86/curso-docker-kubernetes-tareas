const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogdb';
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Redis client (v4)
const redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

// Mongoose model
mongoose.connect(MONGO_URI, { maxPoolSize: 10 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', postSchema);

// Helper cache keys
const LIST_KEY = 'posts:list';

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// GET /api/posts - list posts, with cache
app.get('/api/posts', async (req, res) => {
  try {
    const cached = await redisClient.get(LIST_KEY);
    if (cached) {
      console.log('Cache HIT for list');
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    console.log('Cache MISS for list');
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    await redisClient.set(LIST_KEY, JSON.stringify(posts), { EX: 60 }); // TTL 60s
    return res.json({ source: 'database', data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /api/posts/:id - view post, with cache per id
app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const key = `post:${id}`;
    const cached = await redisClient.get(key);
    if (cached) {
      console.log(`Cache HIT for ${key}`);
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    console.log(`Cache MISS for ${key}`);
    const post = await Post.findById(id).lean();
    if (!post) return res.status(404).json({ error: 'not found' });
    await redisClient.set(key, JSON.stringify(post), { EX: 60 });
    res.json({ source: 'database', data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// POST /api/posts - create post and invalidate cache
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();

    // Invalidate cache list and newly created post key
    await redisClient.del(LIST_KEY);
    await redisClient.del(`post:${post._id}`);

    console.log('Cache invalidated after create');
    res.status(201).json({ message: 'created', data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// PUT /api/posts/:id - update (invalidate cache)
app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!post) return res.status(404).json({ error: 'not found' });

    await redisClient.del(LIST_KEY);
    await redisClient.del(`post:${id}`);
    res.json({ message: 'updated', data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// DELETE /api/posts/:id - delete
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ error: 'not found' });

    await redisClient.del(LIST_KEY);
    await redisClient.del(`post:${id}`);
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Service posts running on ${PORT}`));

