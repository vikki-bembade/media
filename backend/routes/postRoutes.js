import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createPost, getFeed, getPost, updatePost, deletePost, likePost, unlikePost, addComment, updateComment, deleteComment, getComments, uploadMedia } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { validatePost } from '../middleware/validate.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('video') ? 'uploads/videos' : 'uploads/images';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|mp4|mov|webm/;
    const isValid = allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, isValid);
  },
});

router.post('/', protect, upload.single('media'), validatePost, uploadMedia, createPost);
router.get('/feed', protect, getFeed);
router.get('/:id', protect, getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);
router.post('/:id/comments', protect, addComment);
router.put('/:id/comments/:commentId', protect, updateComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);
router.get('/:id/comments', protect, getComments);

export default router;
