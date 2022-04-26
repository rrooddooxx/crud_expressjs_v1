const { Pool } = require("pg");
const { pool_config } = require("../config.js");

// new pool instance

const pool = new Pool(pool_config);

// new participant
async function newParticipant(
  email,
  userName,
  password,
  expYears,
  specialty,
  userPicture,
  state,
  isAdmin
) {
  try {
    const query = {
      text: "INSERT INTO skaters (email, nombre, password, anios_experiencia, especialidad, foto, estado, es_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      values: [
        email,
        userName,
        password,
        expYears,
        specialty,
        userPicture,
        state,
        isAdmin,
      ],
    };
    const response = await pool.query(query);
    return response.rows;
  } catch (error) {
    console.error(error);
    return error;
  }
}

// get participants
async function getParticipants(email, password) {
  if (email && password) {
    try {
      const query = {
        text: "SELECT * FROM skaters WHERE email=$1 AND password=$2",
        values: [email, password],
      };
      const response = await pool.query(query);
      return response.rows[0];
    } catch (error) {
      console.error(error);
      return error;
    }
  } else {
    try {
      const response = await pool.query("SELECT * FROM skaters");
      return response.rows;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

// put participants (only state editing)

async function editParticipant(id, state) {
  const query = {
    text: "UPDATE skaters SET estado=$2 WHERE id=$1 RETURNING *",
    values: [id, state],
  };
  const response = await pool.query(query);
  return response.rows;
}

// put participant profile

async function editParticipantProfile(
  id,
  email,
  nombre,
  password,
  experiencia,
  especialidad
) {
  const query = {
    text: "UPDATE skaters SET nombre=$3, password=$4, anios_experiencia=$5, especialidad=$6 WHERE id=$1 AND email=$2 RETURNING *",
    values: [id, email, nombre, password, experiencia, especialidad],
  };
  const response = await pool.query(query);
  return response.rows[0];
}

// delete single participant
async function deleteParticipant(id, email) {
  try {
    const query = {
      text: "DELETE FROM skaters WHERE id=$1 AND email=$2",
      values: [id, email],
    };
    const response = await pool.query(query);
    return response.rowCount;
  } catch (error) {
    console.log("ERROR EN LA DB: DELETE");
    console.error(error);
    return error;
  }
}

module.exports = {
  newParticipant,
  getParticipants,
  editParticipant,
  editParticipantProfile,
  deleteParticipant,
};
