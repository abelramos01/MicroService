import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Cria uma conexão com o banco de dados
const prisma = new PrismaClient();

// Função para cadastrar um restaurante novo
async function registerRestaurant(req, res) {
  // Pega as informações que o restaurante mandou
  const { name, email, password, address } = req.body;
  // Transforma a senha em um segredo difícil de descobrir
  const hash = await bcrypt.hash(password, 10);
  try {
    // Salva o restaurante no banco de dados com a senha protegida
    const rest = await prisma.restaurants.create({
      data: { name, email, password: hash, address }
    });
    // Responde com o restaurante criado
    res.json(rest);
  } catch (err) {
    // Se der erro, avisa que não conseguiu cadastrar
    res.status(400).json({ error: 'Erro ao cadastrar restaurante' });
  }
}

// Função para fazer login do restaurante
async function loginRestaurant(req, res) {
  // Pega o email e a senha que o restaurante mandou
  const { email, password } = req.body;
  // Procura o restaurante no banco de dados pelo email
  const rest = await prisma.restaurants.findUnique({ where: { email } });
  // Se não achar, avisa que não encontrou
  if (!rest) return res.status(401).json({ error: 'Restaurante não encontrado' });

  // Compara a senha digitada com a senha protegida do banco
  const match = await bcrypt.compare(password, rest.password);
  // Se a senha estiver errada, avisa que está errada
  if (!match) return res.status(401).json({ error: 'Senha incorreta' });

  // Se estiver tudo certo, cria um token mágico para o restaurante ficar logado
  const token = jwt.sign({ id: rest.id }, 'segredo');
  // Responde com o token
  res.json({ token });
}

// Deixa essas funções disponíveis para usar em outros arquivos
export { registerRestaurant, loginRestaurant };