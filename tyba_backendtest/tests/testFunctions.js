// ORM para la conexión a la base de datos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { crearUsuario } = require("../jwt/handler");

/**
 * Crea al usuario 'DanielG' en la base de datos para efectuar las pruebas requeridas
 */
async function crearUsuarioBase() {
  await prisma.usuario
    .findMany({
      where: { username: "DanielG" },
    })
    .then((users) => {
      if (users.length === 0) {
        crearUsuario("DanielG", "ContraseñaDePrueba1");
      }
    });
}

module.exports = { crearUsuarioBase };
