import express from 'express';

import { getAllDishes, createDish,  getDishById, editDish, getCategories, } from '../controllers/dishController.js';
import auth from '../../services/cadastro/middlewares/authmiddleware.js';


const router = express.Router();

router.get('/', getAllDishes);

router.post('/', createDish);

router.put('/:id', editDish);

router.get('/categories', getCategories);

router.get('/:id', getDishById);

export default router;