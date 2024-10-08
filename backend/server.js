const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  category: String,
  image: String, // Store image as base64 or file path
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Set up multer for file upload
const storage = multer.memoryStorage(); // Store the image in memory as base64
const upload = multer({ storage: storage });

// API Endpoints
app.post('/createPost', upload.single('image'), async (req, res) => {
  const { title, description, content, category } = req.body;
  const image = req.file ? req.file.buffer.toString('base64') : null; // Convert the image to base64

  if (!image) {
    return res.status(400).send('Image is required');
  }

  const post = new Post({
    title,
    description,
    content,
    category,
    image, // Store the image as base64 in the database
  });

  try {
    await post.save();
    res.status(201).send('Post saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving post');
  }
});

// API endpoint to fetch all posts
app.get('/getPosts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching posts');
  }
});

// API endpoint to fetch a specific post by ID
app.get('/getPost/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching post');
  }
});



// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
