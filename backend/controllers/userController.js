import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

export const getProfile = async (req, res) => {
  try {
    const targetId = req.params.id === 'me' ? req.user._id : req.params.id;
    const user = await User.findById(targetId).populate('posts').select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.username) updates.username = req.body.username;
    if (req.body.bio !== undefined) updates.bio = req.body.bio;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).select('-password').limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    if (req.user.following.includes(target._id)) {
      return res.status(400).json({ message: 'Already following' });
    }

    req.user.following.push(target._id);
    target.followers.push(req.user._id);
    await req.user.save();
    await target.save();

    await Notification.create({ receiver: target._id, sender: req.user._id, type: 'follow' });
    res.json({ message: 'Followed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });

    req.user.following = req.user.following.filter((id) => id.toString() !== target._id.toString());
    target.followers = target.followers.filter((id) => id.toString() !== req.user._id.toString());
    await req.user.save();
    await target.save();

    res.json({ message: 'Unfollowed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user._id }).populate('sender', 'username name profilePicture').sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ receiver: req.user._id }, { isRead: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
