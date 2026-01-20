const states = ['pendiente', 'aceptada', 'cancelada', 'finalizada'];

export const validarEstadoCita = (req, res, next) => {
    const { estado } = req.body;
    
    // Si el estado no viene en el body, pasamos al siguiente (o puedes obligar a que venga)
    if (estado && !states.includes(estado)) {
        return res.status(400).json({
            error: `Estado no válido. Opciones: ${states.join(', ')}`
        });
    }
    next();
};