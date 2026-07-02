import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;
