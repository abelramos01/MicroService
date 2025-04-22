// importa o PrismaClient do pacote @prisma/client
import { PrismaClient } from '@prisma/client';

// cria uma instância do Prisma para interagir com o banco de dados
const prisma = new PrismaClient();

// função para buscar todas as categorias cadastradas
export const getCategories = async (req, res) => {
    try {
        // busca todas as categorias na tabela "categories"
        const categories = await prisma.categories.findMany();
        // retorna as categorias em formato JSON
        res.json(categories);
    } catch (error) {
        // em caso de erro, retorna status 500 com mensagem de erro
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};

// função para buscar todos os pratos (dishes) com suas respectivas categorias
export const getAllDishes = async (req, res) => {
    try {
        // busca todos os pratos e inclui os dados da categoria relacionada
        const dishes = await prisma.dishes.findMany({
            include: {
                categories: true 
            }
        });
        // retorna os pratos encontrados
        res.json(dishes);
    } catch (error) {
        // em caso de erro, retorna status 500 com mensagem de erro
        res.status(500).json({ error: 'Erro ao buscar dishes' });
    }
};

// função para criar um novo prato
export const createDish = async (req, res) => {
    // extrai os dados enviados no corpo da requisição
    const { name, description, price, categoryId } = req.body;

    try {
        // cria um novo registro na tabela "dishes"
        const newDish = await prisma.dishes.create({
            data: {
                name,
                description,
                price: parseFloat(price), 
                category_id: parseInt(categoryId), 
            }
        });
        // Retorna o prato criado com status 201 (criado)
        res.status(201).json(newDish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao criar prato:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};

// função para buscar um prato específico pelo ID
export const getDishById = async (req, res) => {
    // extrai o ID da rota (URL)
    const { id } = req.params;

    try {
        // busca o prato pelo ID e inclui os dados da categoria relacionada
        const dish = await prisma.dishes.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                categories: true
            }
        });

        // se o prato não for encontrado, retorna status 404
        if (!dish) {
            return res.status(404).json({ error: 'Prato não encontrado' });
        }

        // retorna o prato encontrado
        res.status(200).json(dish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao buscar prato por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar prato' });
    }
};

// função para editar um prato já existente
export const editDish = async (req, res) => {
    // extrai o ID da rota e os dados do corpo da requisição
    const { id } = req.params; 
    const { name, description, price, categoryId } = req.body;

    try {
        // Atualiza o prato com os novos dados
        const modifyDish = await prisma.dishes.update({
            where: {
                id: Number(id) // converte o ID para número
            },
            data: {
                name,
                description,
                price: parseFloat(price), 
                category_id: parseInt(categoryId) 
            }
        });

        // retorna o prato atualizado
        res.status(200).json(modifyDish);
    } catch (error) {
        // em caso de erro, loga no console e retorna status 500
        console.error('Erro ao editar o prato:', error);
        res.status(500).json({ error: 'Erro ao editar o prato' });
    }
};
