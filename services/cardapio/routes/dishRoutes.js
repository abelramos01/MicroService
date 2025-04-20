import express from 'express';

import { getAllDishes, createDish, getCategories} from '../controllers/dishController.js';

const router = express.Router();

router.get('/', getAllDishes);

router.post('/', createDish);

router.get('/categories', getCategories);

export default router;