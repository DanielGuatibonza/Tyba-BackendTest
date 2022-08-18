// ORM para la conexión a la base de datos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const request = require("supertest");
const app = require("../app");
const { crearUsuarioBase } = require("./testFunctions");

describe("Signup tests", () => {
  beforeAll(() => {
    // Se crea el usuario 'DanielG' para probar un correcto login con este
    crearUsuarioBase();
  });
  test("Signup exitoso", () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return request(app)
      .post("/signup")
      .send({ username: "UsuarioDePrueba" + timestamp, password: "prueba" })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Creación de usuario exitosa.");
        expect(response.body.token).not.toBe(undefined);
        prisma.usuario.delete({
          where: { username: "UsuarioDePrueba" + timestamp },
        });
      });
  });
  test("Usuario existente pero contraseña erronea", () => {
    return request(app)
      .post("/signup")
      .send({ username: "DanielG", password: "ContraseñaDePrueba " })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Ya existe un usuario con el nombre dado."
        );
        expect(response.body.token).toBe(undefined);
      });
  });
  test("Credenciales faltantes", () => {
    return request(app)
      .post("/signup")
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
