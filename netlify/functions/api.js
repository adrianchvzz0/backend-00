const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const routes = require("../../routes"); // sube dos niveles si está en raíz

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales (todo irá bajo /api/*)
app.use("/api", routes);

// Middleware de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// Exporta como función
module.exports.handler = serverless(app);
