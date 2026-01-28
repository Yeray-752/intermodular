import DOMPurify from 'isomorphic-dompurify';

/*
Tenemos puesto que en la base de datos que estos mismos lleguen como texto plano
(los ? hacen que sea texto), por lo cual no ocurre nada al introducirse,
pero cuando hago un select para mostrarlos si puede saltar algún script malicioso,
esto lo que hace es asegurarse al 100% de que no hayan scripts sanitizando todos 
los req.bodys antes de hacer nada más
*/
export const autoSanitize = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            // no hace falta sanitizar contraseñas pues estas son hasheadas
            const sensitiveFields = ['password', 'confirmPassword', 'oldPassword', "contraseña"];

            if (typeof req.body[key] === 'string' && !sensitiveFields.includes(key)) {
                req.body[key] = DOMPurify.sanitize(req.body[key]);
            }
        });
    }
    next();
};