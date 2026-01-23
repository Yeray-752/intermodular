import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Formato "Bearer TOKEN"

  if (!token) return res.status(403).json({ error: "No se proporcionó un token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ahora req.user.id y req.user.rol están disponibles en la ruta
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

//Esto evita que alguien se ponga "admin" en el local storage y se pueda meter con permisos de admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado: Se requieren permisos de administrador" });
  }
};