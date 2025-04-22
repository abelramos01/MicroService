import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Função para registrar um novo usuário
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hash
      }
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    // Em caso de erro, retorna status 500 e mensagem de erro
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
}

// Função para login do usuário
async function loginUser(req, res) {
  try {
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
    const token = jwt.sign({ id: user.id },JWT_SECRET, {expiresIn: '7d'});
    // Retorna o token como resposta
    res.status(200).json(token);
  } catch (err) {
    // Em caso de erro, retorna status 500 e mensagem de erro
    res.status(500).json({ message: 'Erro ao logar usuário' });
  }
}

// Exporta as funções para serem usadas em outros arquivos
export { registerUser, loginUser };