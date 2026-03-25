
/**
 * Middleware opcional: validatePath
 * Si prefieres usarlo como un middleware que bloquee la petición antes de llegar al controlador.
 */
export const validatePath = (req, res, next) => {
    const file = req.query.file || req.body.file;
    
    if (file && (file.includes('..') || file.includes('/'))) {
        return res.status(403).json({ 
            message: "Ruta de archivo no permitida. No use caracteres de navegación." 
        });
    }
    next();
};