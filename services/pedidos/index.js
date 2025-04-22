import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
}) 

app.get('/api/orders', async (req, res) => {
  const orders = await prisma.orders.findMany();
  res.send(orders);
}) 

app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, restaurant_id, total, items } = req.body;

    const newOrder = await prisma.orders.create({
      data: {
        user_id,
        restaurant_id,
        total,
        order_items: {
          create: items.map(item => ({
            dish_id: item.dish_id,
            quantity: item.quantity,
          }))
        }
      },
      include: {
        order_items: true
      }
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
