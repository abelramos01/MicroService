import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Cria uma conexão com o banco de dados
const prisma = new PrismaClient();

// Função para registrar um novo usuário
async function registerUser(req, res) {
  // Extrai os dados do corpo da requisição
  const { name, email, password } = req.body;
  // Gera o hash da senha com bcrypt (10 salt rounds)
  const hash = await bcrypt.hash(password, 10);
  try {
    // Cria um novo usuário no banco de dados com os dados fornecidos
    const user = await prisma.users.create({
      data: { name, email, password: hash }
    });
    // Retorna o usuário criado como resposta
    res.json(user);
  } catch (err) {
    // Em caso de erro, retorna status 400 e mensagem de erro
    res.status(400).json({ error: 'Erro ao cadastrar usuário' });
  }
}

// Função para login do usuário
async function loginUser(req, res) {
  // Extrai email e senha do corpo da requisição
  const { email, password } = req.body;
  // Busca o usuário pelo email no banco de dados
  const user = await prisma.users.findUnique({ where: { email } });
  // Se não encontrar o usuário, retorna erro 401
  if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

  // Compara a senha fornecida com o hash armazenado
  const match = await bcrypt.compare(password, user.password);
  // Se a senha não bater, retorna erro 401
  if (!match) return res.status(401).json({ error: 'Senha incorreta' });

  // Gera um token JWT com o id do usuário
  const token = jwt.sign({ id: user.id }, 'segredo');
  // Retorna o token como resposta
  res.json({ token });
}

// Exporta as funções para serem usadas em outros arquivos
module.exports = { registerUser, loginUser };