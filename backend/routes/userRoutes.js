import express from 'express';
import { getProfile, getMe, updateProfile, changePassword, searchUsers, followUser, unfollowUser, getNotifications, markNotificationsRead } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validate.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/profile/:id', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.post('/change-password', protect, changePassword);
router.get('/search', protect, searchUsers);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);
router.get('/notifications', protect, getNotifications);
router.post('/notifications/read', protect, markNotificationsRead);

export default router;
