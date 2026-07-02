import fs from 'fs';
import path from 'path';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const uploadMedia = (req, res, next) => {
  if (!req.file) return next();

  const relativeFolder = path.relative(uploadDir, req.file.destination).replace(/\\/g, '/');
  req.body.media = `/uploads/${relativeFolder}/${req.file.filename}`;
  req.body.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  next();
};

export const createPost = async (req, res) => {
  try {
    const media = req.body.media || (req.file ? `/uploads/${req.file.filename}` : '');
    const mediaType = req.body.mediaType || (req.file?.mimetype.startsWith('video') ? 'video' : 'image');

    if (!media) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const post = await Post.create({
      user: req.user._id,
      media,
      mediaType,
      caption: req.body.caption || '',
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { posts: post._id } });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user', 'name username profilePicture').populate({
      path: 'comments',
      populate: { path: 'user', select: 'username profilePicture' },
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name username profilePicture').populate({
      path: 'comments',
      populate: { path: 'user', select: 'username profilePicture' },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    post.caption = req.body.caption || post.caption;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: post._id } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user._id)) return res.status(400).json({ message: 'Already liked' });

    post.likes.push(req.user._id);
    await post.save();

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({ receiver: post.user, sender: req.user._id, type: 'like', post: post._id });
    }

    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.likes = post.likes.filter((like) => like.toString() !== req.user._id.toString());
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ user: req.user._id, post: post._id, text: req.body.text });
    post.comments.push(comment._id);
    await post.save();

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({ receiver: post.user, sender: req.user._id, type: 'comment', post: post._id });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not allowed' });

    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
    await Comment.findByIdAndDelete(comment._id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('user', 'username profilePicture').sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
