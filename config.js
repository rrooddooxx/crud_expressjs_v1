const PORT = process.env.PORT || 3000;

const MOTD = `
---------------------------------------
Prueba SKATE PARK | Por Sebastián Leiva
Bootcamp JS Full-Stack de DesafíoLatam
---------------------------------------
Servidor arriba en el puerto: ${PORT} 
PID: ${process.pid}
---------------------------------------
`;

const pool_config = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "prueba_skatepark",
};

const fileupload_config = {
  limits: { fileSize: 5000000 },
  abortOnLimit: true,
  responseOnLimit: "Archivo excede tamaño máximo permitido (5mb)",
  /*   safeFileNames: true,
  preserveExtension: true, */
};

module.exports = { PORT, MOTD, pool_config, fileupload_config };
