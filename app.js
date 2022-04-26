// imports
const express = require("express");
const app = express();
const viewsRouter = require("./routes/views.js");
const apiRouter = require("./routes/api.js");
const { PORT, MOTD, fileupload_config } = require("./config.js");
const exphbs = require("express-handlebars");
const crypto = require("crypto");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");

// secret key generation
function generateHash() {
  //crypto secretkey
  const secretKey = crypto.randomBytes(256).toString("base64");
  const hash = crypto.createHmac("sha256", secretKey).digest("hex");
  return `SECRET_KEY="${hash}"`;
}
fs.writeFileSync(".ENV", generateHash().toString());

// cookie-parser middleware
app.use(cookieParser());

// fupload middleware
app.use(fileUpload(fileupload_config));

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// handlebars
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    extname: "hbs",
  })
);

// static middlewares
app.use(express.static(__dirname + "/public"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/axios", express.static(__dirname + "/node_modules/axios/dist"));

// routes
app.use("/api/v1/", apiRouter);
app.use("/", viewsRouter);

// server launch
app.listen(PORT, () => console.log(MOTD));
