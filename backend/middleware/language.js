import db from "../db.js"; // ¡IMPORTANTE: Asegúrate de importar tu conexión a DB!

export const languageMiddleware = async (req, res, next) => {
  try {
    // 1. Consultas los idiomas activos
    const [rows] = await db.query("SELECT code FROM languages WHERE active = 1");
    const supportedLangs = rows.map(lang => lang.code); 

    // 2. Detectas el idioma del usuario (Header o por defecto)
    let lang = req.headers['accept-language']?.split(',')[0].substring(0, 2) || 'es';

    // 3. Verificas si es válido, si no, usas el default
    req.lang = supportedLangs.includes(lang) ? lang : 'es'; 
    
    next();
  } catch (error) {
    console.error("Error en el middleware de idioma:", error);
    req.lang = 'es'; // Fallback en caso de que falle la DB
    next();
  }
};