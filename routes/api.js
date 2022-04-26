const express = require("express");
const router = express.Router();
const {
  newParticipant,
  getParticipants,
  editParticipant,
  editParticipantProfile,
  deleteParticipant,
} = require("../model/queries.js");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* --------------------------------------
CRUD API routes
/api/v1/*
-------------------------------------- */

// get participants
router.get("/participants", async (req, res) => {
  try {
    const response = await getParticipants();
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: `Hubo un error en el lado del servidor: ${error}`,
      code: 500,
    });
  }
});

// post participants
router.post("/participants", async (req, res) => {
  req.body.isAdmin == null ? (req.body.isAdmin = false) : req.body.isAdmin;

  if (
    !req.body.email ||
    !req.body.userName ||
    !req.body.password ||
    !req.body.expYears ||
    !req.body.specialty ||
    !req.files.userPicture
  ) {
    const alerta =
      "<script>const alertMsg = document.getElementById('alert-msg') alertMsg.innerText= 'Error en el envío. Revise los campos e intente nuevamente'</script>";
    res.send(alerta);
  } else {
    try {
      // form values
      const { email, userName, password, expYears, specialty, isAdmin } =
        req.body;

      // fupload values
      const uploadDir = path.join(__dirname, "../public/uploads");
      const { userPicture } = req.files;
      const { name: picFileName } = userPicture;

      function randomNameGenerator(fname) {
        const splitArr = fname.split(".");
        const fileExt = splitArr.pop();
        return `${uuidv4().slice(19)}.${fileExt}`;
      }
      const newPicFileName = randomNameGenerator(picFileName);
      // actions
      userPicture.mv(`${uploadDir}/${newPicFileName}`, (error) => {
        if (error) console.error(error);
        return;
      });
      const response = await newParticipant(
        email,
        userName,
        password,
        expYears,
        specialty,
        `/uploads/${newPicFileName}`,
        false,
        isAdmin
      );
      res.status(201).redirect("/login");
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: `Hubo un error en el lado del servidor: ${error}`,
        code: 500,
      });
    }
  }
});

// put participants
router.put("/participants", async (req, res) => {
  try {
    const { data } = req.body;
    const response = await editParticipant(data.id, data.state);
    res.status(201).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: `Hubo un error en el lado del servidor: ${error}`,
      code: 500,
    });
  }
});

// put single participant profile
router.put("/participants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, password, experiencia, especialidad } = req.body;
    const response = await editParticipantProfile(
      id,
      email,
      nombre,
      password,
      experiencia,
      especialidad
    );
    res.send(response);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// delete participant
router.delete("/participants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const response = await deleteParticipant(id, email);
    res.status(200).send("User Deleted");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// post login
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await getParticipants(email, password);
  if (user) {
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        data: user,
      },
      secret_key,
      {
        algorithm: "HS256",
        expiresIn: 1800,
      }
    );

    res.status(200).send({ token });
  } else {
    res.send({
      message: "Auth Failed",
      error: 404,
    });
  }
});

module.exports = router;
