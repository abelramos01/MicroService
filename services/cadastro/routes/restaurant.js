import express from 'express';
import {registerRestaurant, loginRestaurant} from '../controllers/authRestController.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', registerRestaurant);
router.post('/login', loginRestaurant);

export default router;