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