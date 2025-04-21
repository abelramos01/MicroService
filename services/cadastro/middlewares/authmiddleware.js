import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, 'segredo');
    req.restaurantId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}


export default auth;