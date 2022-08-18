const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../jwt/tokenManager");
const { crearUsuarioBase } = require("./testFunctions");

let token;
describe("Tests de búsqueda de restaurantes", () => {
  beforeAll(() => {
    // Se crea el usuario 'DanielG' para realizar la búsqueda sobre dicho usuario
    crearUsuarioBase();
    token = generateToken("DanielG");
  });

  test("Búsqueda exitosa", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
        latitud: 4.639679299149647,
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.body.message).toBe("Búsqueda de restaurantes exitosa.");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.restaurantes.length).toBeGreaterThan(0);
        expect(response.body.restaurantes[0]["nombre"]).not.toBe(undefined);
        expect(response.body.restaurantes[0]["rating"]).not.toBe(undefined);
        expect(response.body.restaurantes[0]["direccion"]).not.toBe(undefined);
      });
  });
  test("Usuario erróneo", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG ",
        latitud: 4.639679299149647,
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "El nombre de usuario dado no está registrado."
        );
      });
  });
  test("Usuario faltante", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + token })
      .send({
        latitud: 4.639679299149647,
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Debe otorgar el nombre de usuario y ubicación (latitud y longitud) para hacer la búsqueda."
        );
      });
  });
  test("Latitud faltante", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Debe otorgar el nombre de usuario y ubicación (latitud y longitud) para hacer la búsqueda."
        );
      });
  });
  test("Longitud faltante", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
        latitud: 4.639679299149647,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Debe otorgar el nombre de usuario y ubicación (latitud y longitud) para hacer la búsqueda."
        );
      });
  });
  test("Token faltante", () => {
    return request(app)
      .post("/restaurantes")
      .send({
        username: "DanielG ",
        latitud: 4.639679299149647,
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Por favor ingrese el token.");
      });
  });
  test("Token inválido", () => {
    return request(app)
      .post("/restaurantes")
      .set({ Authorization: "Bearer " + "abcd" })
      .send({
        username: "DanielG ",
        latitud: 4.639679299149647,
        longitud: -74.0785628956084,
      })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("El token no es válido.");
      });
  });
});

describe("Test de búsqueda del histórico", () => {
  beforeAll(() => {
    // Se crea el usuario 'DanielG' para realizar la búsqueda sobre dicho usuario
    crearUsuarioBase();
    token = generateToken("DanielG");
  });

  test("Búsqueda exitosa en página por defecto", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Búsqueda del histórico exitosa.");
        expect(response.body.page).toBe(1);
        expect(response.body.regsPerPage).toBeLessThanOrEqual(10);
        expect(response.body.transacciones.length).toBeLessThanOrEqual(10);
        expect(response.body.transacciones.length).toBeGreaterThan(0);
        expect(response.body.transacciones[0]["id"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["username"]).toBe("DanielG");
        expect(response.body.transacciones[0]["latitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["longitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["restaurante"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["rating"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["direccion"]).not.toBe(undefined);
      });
  });
  test("Usuario erróneo", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG ",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "El nombre de usuario dado no está registrado."
        );
        expect(response.body.transacciones).toBe(undefined);
      });
  });
  test("Usuario faltante", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          "Debe otorgar el nombre de usuario para realizar la búsqueda de su histórico."
        );
        expect(response.body.transacciones).toBe(undefined);
      });
  });
  test("Búsqueda exitosa en página 2", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
        page: 2,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Búsqueda del histórico exitosa.");
        expect(response.body.page).toBe(2);
        expect(response.body.regsPerPage).toBeLessThanOrEqual(10);
        expect(response.body.transacciones.length).toBeLessThanOrEqual(10);
        expect(response.body.transacciones.length).toBeGreaterThan(0);
        expect(response.body.transacciones[0]["id"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["username"]).toBe("DanielG");
        expect(response.body.transacciones[0]["latitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["longitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["restaurante"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["rating"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["direccion"]).not.toBe(undefined);
      });
  });
  test("Búsqueda exitosa con 20 registros en página 1", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + token })
      .send({
        username: "DanielG",
        page: 1,
        regsPerPage: 20,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Búsqueda del histórico exitosa.");
        expect(response.body.page).toBe(1);
        expect(response.body.regsPerPage).toBeLessThanOrEqual(20);
        expect(response.body.transacciones.length).toBeLessThanOrEqual(20);
        expect(response.body.transacciones.length).toBeGreaterThan(0);
        expect(response.body.transacciones[0]["id"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["username"]).toBe("DanielG");
        expect(response.body.transacciones[0]["latitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["longitudBusqueda"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["restaurante"]).not.toBe(
          undefined
        );
        expect(response.body.transacciones[0]["rating"]).not.toBe(undefined);
        expect(response.body.transacciones[0]["direccion"]).not.toBe(undefined);
      });
  });
  test("Token faltante", () => {
    return request(app)
      .post("/restaurantes/historico")
      .send({
        username: "DanielG",
      })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Por favor ingrese el token.");
      });
  });
  test("Token inválido", () => {
    return request(app)
      .post("/restaurantes/historico")
      .set({ Authorization: "Bearer " + "abcd" })
      .send({
        username: "DanielG ",
      })
      .then((response) => {
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("El token no es válido.");
      });
  });
});
