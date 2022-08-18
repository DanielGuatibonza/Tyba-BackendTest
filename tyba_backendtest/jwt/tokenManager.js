const jwt = require("jsonwebtoken");

/**
 * Verifica que el token recibido sea valido
 * @param {Request} req - Solicitud del servicio.
 * @param {Response} res - Objeto de respuesta al servicio.
 * @param {Function} next  - Función que se ejecuta luego de la validación
 */
function checkToken(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          res.status(404).send({
            success: false,
            message: "El token no es válido.",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  } else {
    res.status(404).send({
      success: false,
      message: "Por favor ingrese el token.",
    });
  }
}

/**
 * Genera el token de sesión para un usuario
 * @param {String} username - Nombre de usuario a quien generar el token
 * @returns El token como String
 */
function generateToken(username) {
  return jwt.sign({ username }, process.env.SECRET, {
    expiresIn: "24h",
  });
}

module.exports = { generateToken, checkToken };
