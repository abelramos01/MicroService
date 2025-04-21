import express from 'express';
import { registerUser, loginUser } from '../controllers/authUserController.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;