import sharp from "sharp";
import fs from "fs";
import path from "path";

export const processImage = (folder = "general") => {
  return async (req, res, next) => {
    try {
      if (!req.file) return next();

      const filename = `${folder}-${Date.now()}.webp`;
      const uploadPath = path.join("public/uploads", folder);

      // Crear carpeta si no existe
      fs.mkdirSync(uploadPath, { recursive: true });

      const filepath = path.join(uploadPath, filename);

      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      req.file.filename = filename;
      req.file.path = `/uploads/${folder}/${filename}`;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error procesando imagen" });
    }
  };
};