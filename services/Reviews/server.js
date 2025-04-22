import express from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Simula o __dirname no contexto de módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

// const prisma = new PrismaClient();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/reviews', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reviews.html'));
})

app.get('/api/reviews', async (req, res) => {
      const reviews = await prisma.reviews.findMany();
      res.send(reviews)
});
app.get('/api/users', async (req, res) => {
    const users = await prisma.users.findMany();
    res.send(users)
});
app.get('/api/restaurants', async (req, res) => {
    const restautantes = await prisma.restaurants.findMany();
    res.send(restautantes)
});
app.get('/api/order_items', async (req, res) => {
  const items = await prisma.order_items.findMany();
  res.send(items)
});
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.orders.findMany();
  res.send(orders);
});
app.get('/api/dishes', async (req, res) => {
  const dishes = await prisma.dishes.findMany();
  res.send(dishes);
});
app.get('/api/categories', async (req, res) => {
  const categories = await prisma.categories.findMany();
  res.send(categories);
});

async function funcionar() {
  const usuarios = await prisma.users.findMany();
  console.log(usuarios);
}

funcionar();

app.listen(port, () => {
  console.log(`Exemplo de app rodando em http://localhost:${port}`);
})

// app.get('/api/reviews', getReviews);