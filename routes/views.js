const express = require("express");
const router = express.Router();
const {
  newParticipant,
  getParticipants,
  editParticipant,
} = require("../model/queries.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* --------------------------------------
frontend routes
-------------------------------------- */

// check if logged in index view middleware
router.use("/", (req, res, next) => {
  if (req.cookies.token) {
    const { token } = req.cookies;
    const secret_key = process.env.SECRET_KEY;
    jwt.verify(token, secret_key, (err, decode) => {
      if (err) {
        res.locals.isLogged = false;
        next();
      } else {
        res.locals.isLogged = true;
        next();
      }
    });
  } else {
    res.locals.isLogged = false;
    next();
  }
});

// index
router.get("/", async (req, res) => {
  try {
    const getUsersFromApi = await getParticipants();
    const sortedArr = getUsersFromApi.sort((a, b) => a.id - b.id);
    const isLogged = res.locals.isLogged;

    res.render("index", {
      title: "SkatePark APP | Dev: Sebastián Leiva (@wwiiddeewweebb)",
      users: sortedArr,
      isLogged,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fatal en el servidor (probablemente la conexión a la DB)",
      code: 500,
    });
  }
});

// check auth admin middleware
router.use("/admin", (req, res, next) => {
  const { token } = req.cookies;
  const secret_key = process.env.SECRET_KEY;
  jwt.verify(token, secret_key, (err, decode) => {
    if (err) {
      res.redirect("/");
    } else {
      const {
        data: { es_admin },
      } = decode;
      if (es_admin == true) {
        next();
      } else {
        res.render("notauthorized");
      }
    }
  });
});

// get admin
router.get("/admin", async (req, res) => {
  const getUsersFromApi = await getParticipants();
  const sortedArr = getUsersFromApi.sort((a, b) => a.id - b.id);
  res.render("admin", {
    title: "SkatePark APP | Admin Console",
    users: sortedArr,
  });
});

// middleware perfil check token
router.use("/perfil", async (req, res, next) => {
  const secret_key = process.env.SECRET_KEY;
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret_key, async (err, decoded) => {
      if (err) {
        res.redirect("/login");
      } else {
        const { email, password } = decoded.data;
        const user = await getParticipants(email, password);
        res.locals.userData = user;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
});

// get perfil
router.get("/perfil", async (req, res) => {
  const userData = res.locals.userData;
  res.render("perfil", {
    title: "SkatePark APP | Perfil",
    user: userData,
  });
});

// get login
router.get("/login", (req, res) => {
  res.render("login", {
    title: "SkatePark APP | Inicio de Sesión",
  });
});

// get logout
router.get("/logout", (req, res) => {
  res.render("logout");
});

// get registro
router.get("/registro", (req, res) => {
  res.render("registro", {
    title: "SkatePark APP | Registro de Usuario",
  });
});

module.exports = router;
