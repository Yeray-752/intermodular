import path from 'path';
import { fileURLToPath } from 'url';
/**
Quizas un mamarracho intenta saltar directorios al hacer como que introduce algún dato,
esto evita que eso pueda ocurrir
 */

//
const __filename = fileURLToPath(import.meta.url);
//Esta variable si es usada por node, aunque no lo parezca, ya que es una variable de entorno
const __dirname = path.dirname(__filename);

/**
 * Utility: getSafePath
 * Previene el Directory Traversal "aplanando" el nombre del archivo.
 * @param {string} subFolder - Carpeta dentro de 'public' (ej: 'uploads', 'avatars')
 * @param {string} userInput - El nombre del archivo que viene del req.query o req.body
 */
export const getSafePath = (subFolder, userInput) => {
    // 1. path.basename elimina cualquier intento de ../ o rutas absolutas.
    // Transforma "../../../etc/passwd" en "passwd"
    const fileName = path.basename(userInput);

    // 2. Construimos la ruta hacia la carpeta deseada (ej: raíz/public/uploads/nombre.jpg)
    // Usamos process.cwd() para referenciarnos siempre a la raíz del proyecto
    const safePath = path.join(process.cwd(), 'public', subFolder, fileName);

    return safePath;
};

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