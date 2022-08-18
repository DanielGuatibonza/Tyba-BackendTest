// ORM para la conexión a la base de datos
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Librerías utilizadas
const express = require("express");
const router = express.Router();
const nodeFetch = require("node-fetch");
const { checkToken } = require("../jwt/tokenManager");

// Url asociada al API de Google utilizado
const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const defaultParameters = "&radius=1500&type=restaurant&key=";

// Servicio para obtener los restaurantes más cercanos
router.post("/", checkToken, (req, res) => {
  if (req.body.latitud && req.body.longitud && req.body.username) {
    prisma.usuario
      .findMany({
        where: { username: req.body.username },
      })
      .then((users) => {
        if (users.length > 0) {
          // Obtención de los restaurantes
          const location =
            "location=" + req.body.latitud + "%2C" + req.body.longitud;
          const completeUrl =
            baseUrl + location + defaultParameters + process.env.API_KEY;
          nodeFetch(completeUrl)
            .then((response) => response.json())
            .then((data) => {
              let compactData = data.results.map((rest) => {
                return {
                  nombre: rest.name,
                  rating: rest.rating,
                  direccion: rest.vicinity,
                };
              });
              // Almacenamiento de las transacciones
              let promises = [];
              for (let index = 0; index < compactData.length; index++) {
                const rest = compactData[index];
                promises.push(
                  prisma.transaccion.create({
                    data: {
                      user: { connect: { username: req.body.username } },
                      latitudBusqueda: req.body.latitud,
                      longitudBusqueda: req.body.longitud,
                      restaurante: rest.nombre,
                      rating: rest.rating,
                      direccion: rest.direccion,
                    },
                  })
                );
              }
              // Respuesta de los restaurantes una vez almacenados
              Promise.all(promises).then(() => {
                res.send({
                  success: true,
                  message: "Búsqueda de restaurantes exitosa.",
                  restaurantes: compactData,
                });
              });
            })
            .catch(() => {
              res.status(500).send({
                success: false,
                message:
                  "No fue posible obtener los restaurantes más cercanos a tu ubicación.",
              });
            });
        } else {
          res.status(400).send({
            success: false,
            message: "El nombre de usuario dado no está registrado.",
          });
        }
      });
  } else {
    res.status(400).send({
      success: false,
      message:
        "Debe otorgar el nombre de usuario y ubicación (latitud y longitud) para hacer la búsqueda.",
    });
  }
});

// Servicio para obtener el historico de transacciones de búsqueda de restaurantes
router.post("/historico", checkToken, (req, res) => {
  if (req.body.username) {
    prisma.usuario
      .findMany({
        where: { username: req.body.username },
      })
      .then((users) => {
        if (users.length > 0) {
          // Variables de paginación dado el volumen de datos de la consulta
          let page = 1;
          let regsPerPage = 10;
          if (req.body.page) {
            page = req.body.page;
          }
          if (req.body.regsPerPage) {
            regsPerPage = req.body.regsPerPage;
          }
          // Consulta de transacciones con la base de datos
          prisma.transaccion
            .findMany({
              where: { username: req.body.username },
              skip: (page - 1) * regsPerPage,
              take: regsPerPage,
            })
            .then((transactions) => {
              res.send({
                success: true,
                message: "Búsqueda del histórico exitosa.",
                page,
                regsPerPage,
                transacciones: transactions,
              });
            })
            .catch(() => {
              res.status(500).send({
                success: false,
                message:
                  "No fue posible obtener el histórico de transacciones del usuario.",
              });
            });
        } else {
          res.status(400).send({
            success: false,
            message: "El nombre de usuario dado no está registrado.",
          });
        }
      });
  } else {
    res.status(400).send({
      success: false,
      message:
        "Debe otorgar el nombre de usuario para realizar la búsqueda de su histórico.",
    });
  }
});

module.exports = router;
