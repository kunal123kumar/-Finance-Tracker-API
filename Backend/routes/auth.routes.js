import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerRules, loginRules, validate } from '../middleware/validate.js';


const router = express.Router();

router.post('/register',registerRules, validate, register);
router.post('/login',loginRules, validate, login);

export default router;