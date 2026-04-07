import sharp from "sharp";
import fs from "fs";
import path from "path";
import slugify from "slugify";

export const processImage = (folder = "general") => {
  return async (req, res, next) => {
    try {
      if (!req.file) return next();

      // Nombre original sin extensión
      const originalName = path.parse(req.file.originalname).name;

      // Crear nombre seguro
      const normalizedName = originalName
        .normalize("NFD")       
        .replace(/[\u0300-\u036f]/g, "")          
        .replace(/[ñ]/g, "n")                     
        .replace(/[Ñ]/g, "N");

      const safeName = slugify(normalizedName, { lower: true, strict: true });

      // Nombre final con timestamp y extensión .webp
      const filename = `${safeName}-${Date.now()}.webp`;

      // Ruta absoluta a la carpeta de uploads
      const uploadPath = path.join(process.cwd(), "public", "uploads", folder);

      // Crear carpeta si no existe
      fs.mkdirSync(uploadPath, { recursive: true });

      const filepath = path.join(uploadPath, filename);

      // Convertir a webp y guardar
      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      // Guardamos info en req.file para el controlador
      req.file.filename = filename;
      req.file.path = `/uploads/${folder}/${filename}`;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error procesando imagen" });
    }
  };
};