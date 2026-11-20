const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal');
    req.usuarioId = decoded.id;
    req.usuarioRol = decoded.rol; // <-- GUARDAR EL ROL EN LA REQUEST
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// NUEVO: Middleware para verificar si es administrador
const adminMiddleware = (req, res, next) => {
  if (req.usuarioRol !== 'admin') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren permisos de administrador.' 
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };