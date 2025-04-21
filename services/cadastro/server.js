import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import userRoutes from './routes/user.js';
import restaurantRoutes from './routes/restaurant.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Necessário para __dirname funcionar com ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pastas públicas
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../views')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/inicio.html'));
});
// Página de cadastro de usuário
app.get('/user/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/cadastroUsuario.html'));
});

// Página de cadastro de restaurante
app.get('/restaurant/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/cadastroRestaurante.html'));
});

// Rotas
app.use('/user', userRoutes);
app.use('/restaurant', restaurantRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Cadastro rodando em http://localhost:${PORT}`);
});
