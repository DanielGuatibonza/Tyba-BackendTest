// ORM para la conexión a la base de datos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const request = require("supertest");
const app = require("../app");
const { crearUsuarioBase } = require("./testFunctions");

describe("Login tests", () => {
  beforeAll(() => {
    // Se crea el usuario 'DanielG' para probar un correcto login con este
    crearUsuarioBase();
    // Se elimina el usuario 'DanielGuatibonza' en caso de que exista para validar el
    // comportamiento del login cuando el usuario enviado no existe
    prisma.usuario
      .findMany({
        where: { username: "DanielGuatibonza" },
      })
      .then((users) => {
        if (users.length > 0) {
          prisma.usuario.delete({
            where: { username: "DanielGuatibonza" },
          });
        }
      });
  });
  test("Login exitoso", () => {
    return request(app)
      .post("/login")
      .send({ username: "DanielG", password: "ContraseñaDePrueba1" })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Autenticación exitosa.");
        expect(response.body.token).not.toBe(null);
      });
  });
  test("Contraseña incorrecta", () => {
    return request(app)
      .post("/login")
      .send({ username: "DanielG", password: "ContraseñaDePrueba1 " })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Las credenciales ingresadas no son correctas."
        );
        expect(response.body.token).toBe(undefined);
      });
  });
  test("Usuario inexistente", () => {
    return request(app)
      .post("/login")
      .send({ username: "DanielGuatibonza", password: "ContraseñaDePrueba1" })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Las credenciales ingresadas no son correctas."
        );
        expect(response.body.token).toBe(undefined);
      });
  });
  test("Credenciales faltantes", () => {
    return request(app)
      .post("/login")
      .send({ username: "", password: "" })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Debe ingresar las credenciales de usuario y contraseña."
        );
        expect(response.body.token).toBe(undefined);
      });
  });
});
