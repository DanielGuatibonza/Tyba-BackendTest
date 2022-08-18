// ORM para la conexión a la base de datos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Librería para guardar la contraseña con hash y salt
const bcrypt = require("bcrypt");
// Módulo encargado del manejo de tokens de sesión
const { generateToken } = require("./tokenManager");

/**
 * Valida que las credenciales provenientes en el Request sean correctas. En tal caso,
 * responde también con un token para la sesión.
 * @param {Request} req - Solicitud del servicio.
 * @param {Response} res - Objeto de respuesta al servicio.
 */
function login(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    prisma.usuario
      .findMany({
        where: { username },
      })
      .then((users) => {
        if (users.length == 1) {
          bcrypt.compare(password, users[0].password, function (err, result) {
            if (result) {
              const token = generateToken(username);
              res.send({
                success: true,
                message: "Autenticación exitosa.",
                token,
              });
            } else {
              res.status(404).send({
                success: false,
                message: "Las credenciales ingresadas no son correctas.",
              });
            }
          });
        } else {
          res.status(404).send({
            success: false,
            message: "Las credenciales ingresadas no son correctas.",
          });
        }
      })
      .catch(() => {
        res.status(500).send({
          success: false,
          message: "Ocurrió un error al acceder a la base de datos.",
        });
      });
  } else {
    res.status(400).send({
      success: false,
      message: "Debe ingresar las credenciales de usuario y contraseña.",
    });
  }
}

/**
 * Crea un nuevo usuario en la base de datos de acuerdo al Request si este no existe. En este caso,
 * responde también con un token para la sesión.
 * Guarda de forma segura la constraseña haciendo uso de hash y salt
 * @param {Request} req - Solicitud del servicio.
 * @param {Response} res - Objeto de respuesta al servicio.
 */
async function signup(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    prisma.usuario
      .findMany({
        where: { username },
      })
      .then((users) => {
        if (users.length > 0) {
          res.status(404).send({
            success: false,
            message: "Ya existe un usuario con el nombre dado.",
          });
        } else {
          crearUsuario(username, password);
          const token = generateToken(username);
          res.send({
            success: true,
            message: "Creación de usuario exitosa.",
            token,
          });
        }
      });
  } else {
    res.status(400).send({
      success: false,
      message: "Debe ingresar las credenciales de usuario y contraseña.",
    });
  }
}

function crearUsuario(username, password) {
  const saltRounds = 10;
  return bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      prisma.usuario.create({ data: { username, password: hash } }).then();
    });
  });
}

// El logout del usuario debe realizarse del lado del cliente al borrar el registro del token suministrado.
// Sin dicho token el usuario no podrá acceder a las funcionalidades que requieren de estar registrado;
// en este caso la búsqueda de restaurantes y el histórico.

module.exports = { login, signup, crearUsuario };
