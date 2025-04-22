import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const criarPedido = async (req, res) => {
  const { user_id, restaurant_id, total, status, order_items} = req.body;

  try {
    const pedido = await prisma.orders.create({
      data: {
        user_id,
        restaurant_id,
        total,
        status,
        order_items: {
          create: order_items.map(item => ({
            dish_id: item.dish_id,
            quantity: item.quantity
          }))
        }
      },
      include: {
        order_items: true
      }
    });

    res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

export const listarPedidos = async (req, res) => {
    try {
      const pedidos = await prisma.orders.findMany({
        include: {
          order_items: {
            include: {
              dishes: true 
            }
          }
        }
      });
  
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  };  