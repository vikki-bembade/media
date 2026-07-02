import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, password: hashedPassword });
    const token = createToken(user._id);

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
