import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

// Função para cadastrar um restaurante novo
async function registerRestaurant(req, res) {
  try {
    const { name, email, password, address } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt); 

    await prisma.restaurants.create({
      data: {
        name,
        email,
        password: hash,
        address
      }
    });
    res.status(201).json({ message: 'Restaurante cadastrado com sucesso' });
  } catch (err) {
    // Se der erro, avisa que não conseguiu cadastrar
    res.status(500).json({ error: 'Erro ao cadastrar restaurante' });
  }
}

// Função para fazer login do restaurante
async function loginRestaurant(req, res) {
  try {
    const { email, password } = req.body;
    // Procura o restaurante no banco de dados pelo email
    const rest = await prisma.restaurants.findUnique({ where: { email } });
    // Se não achar, avisa que não encontrou
    if (!rest) return res.status(401).json({ error: 'Restaurante não encontrado' });
    //compara a senha digitada com o hash armazenado
    const match = await bcrypt.compare(password, rest.password);
    // Se a senha estiver errada, avisa que está errada
    if (!match) return res.status(401).json({ error: 'Senha incorreta' });

    //gera um token JWT com o id do restaurante
    const token = jwt.sign({ id: rest.id }, JWT_SECRET, { expiresIn: '7d' });
    // Retorna o token como resposta
    res.status(200).json({ token });
  }  catch (err) {
    // Se der erro, avisa que não conseguiu logar
    res.status(500).json({ error: 'Erro ao logar restaurante' });
    }
  }

// Deixa essas funções disponíveis para usar em outros arquivos
export { registerRestaurant, loginRestaurant };