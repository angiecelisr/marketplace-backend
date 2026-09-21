const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Formato habitual: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro');
    req.user = verified; // Contiene { id, email, role, etc. }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authenticateToken;