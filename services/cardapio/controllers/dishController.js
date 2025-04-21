import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};


export const getAllDishes = async (req, res) => {
    try {
        const dishes = await prisma.dishes.findMany({
            include: {
                categories: true 
            }
        });
        res.json(dishes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dishes' });
    }
};


export const createDish = async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    try {
        const newDish = await prisma.dishes.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                category_id: parseInt(categoryId),
            }
        });
        res.status(201).json(newDish);
    } catch (error) {
        console.error('Erro ao criar prato:', error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
};


export const getDishById = async (req, res) => {
    const { id } = req.params;

    try {
        const dish = await prisma.dishes.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                categories: true
            }
        });

        if (!dish) {
            return res.status(404).json({ error: 'Prato não encontrado' });
        }

        res.status(200).json(dish);
    } catch (error) {
        console.error('Erro ao buscar prato por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar prato' });
    }
};


export const editDish = async (req, res) => {
    const { id } = req.params; 
    const { name, description, price, categoryId } = req.body;

    try {
        const modifyDish = await prisma.dishes.update({
            where: {
                id: Number(id) 
            },
            data: {
                name,
                description,
                price: parseFloat(price),
                category_id: parseInt(categoryId) 
            }
        });

        res.status(200).json(modifyDish);
    } catch (error) {
        console.error('Erro ao editar o prato:', error);
        res.status(500).json({ error: 'Erro ao editar o prato' });
    }
};
