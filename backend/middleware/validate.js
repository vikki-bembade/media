export const validateRegistration = (req, res, next) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { name, username, bio } = req.body;

  if (!name && !username && !bio) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  next();
};

export const validatePost = (req, res, next) => {
  if (!req.body.caption && !req.file) {
    return res.status(400).json({ message: 'Please provide a caption or media file' });
  }

  next();
};
