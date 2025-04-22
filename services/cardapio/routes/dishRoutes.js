// importa o Express, framework para criação de servidores HTTP
import express from 'express';

// importa as funções controladoras responsáveis pelas operações com pratos e categorias
import {
    getAllDishes,     // buscar todos os pratos
    createDish,       // criar um novo prato
    getDishById,      // buscar prato por ID
    editDish,         // editar um prato existente
    getCategories     // buscar todas as categorias
} from '../controllers/dishController.js';

// cria um roteador do Express para definir as rotas
const router = express.Router();

// rota GET para listar todos os pratos (ex: GET /dishes)
router.get('/', getAllDishes);

// rota POST para criar um novo prato (ex: POST /dishes)
router.post('/', createDish);

// rota PUT para editar um prato existente, passando o ID como parâmetro (ex: PUT /dishes/1)
router.put('/:id', editDish);

// rota GET para buscar todas as categorias (ex: GET /dishes/categories)
router.get('/categories', getCategories);

// rota GET para buscar um prato específico por ID (ex: GET /dishes/1)
router.get('/:id', getDishById);

// exporta o roteador para ser usado em outras partes do sistema
export default router;
