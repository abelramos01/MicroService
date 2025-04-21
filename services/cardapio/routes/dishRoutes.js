import express from 'express';

import { getAllDishes, createDish, getCategories} from '../controllers/dishController.js';
import auth from '../../services/cadastro/middlewares/authmiddleware.js';

const router = express.Router();

router.get('/', auth, getAllDishes);

router.post('/', auth, createDish);

router.get('/categories', auth, getCategories);

export default router;