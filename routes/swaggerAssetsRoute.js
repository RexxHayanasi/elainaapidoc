const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const router = express.Router();

// CSS kustom untuk Swagger UI
const customCss = `
    .swagger-ui {
        background-image: url('https://pomf2.lain.la/f/z08tomiw.jpg');
        background-size: cover;
        background-position: center;
    }
    .swagger-ui .topbar {
        background: rgba(0, 0, 0, 0.7) !important;
    }
    .swagger-ui .topbar .download-continue,
    .swagger-ui .topbar .title,
    .swagger-ui .topbar .link {
        color: #fff !important;
    }
    .swagger-ui .info,
    .swagger-ui .scheme-container {
        background: rgba(0, 0, 0, 0.5) !important;
        color: #fff !important;
    }
    .swagger-ui .btn {
        background-color: #007bff !important;
        color: #fff !important;
    }
    .swagger-ui .btn:hover {
        background-color: #0056b3 !important;
    }
`;

// Serve Swagger documentation beserta CSS kustom
router.get(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);

// Middleware untuk melayani file Swagger UI assets
router.get("/swagger-ui.css", async (req, res) => {
  const url = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui.min.css";
  const response = await axios.get(url);
  res.set("Content-Type", "text/css");
  res.send(response.data);
});

router.get("/swagger-ui-bundle.js", async (req, res) => {
  const url = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui-bundle.min.js";
  const response = await axios.get(url);
  res.set("Content-Type", "application/javascript");
  res.send(response.data);
});

router.get("/swagger-ui-standalone-preset.js", async (req, res) => {
  const url = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui-standalone-preset.min.js";
  const response = await axios.get(url);
  res.set("Content-Type", "application/javascript");
  res.send(response.data);
});

router.get("/swagger-ui-init.js", async (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`window.onload = function () {
    const ui = SwaggerUIBundle({
      url: "/swagger.json",
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: "BaseLayout",
      deepLinking: true,
    });
  };`);
});

// Middleware untuk menyembunyikan /swagger.json
router.use((req, res, next) => {
  if (req.path === "/swagger.json") {
    res.status(404).send("Not found");
  } else {
    next();
  }
});

// Rute untuk menampilkan swagger.json jika diperlukan
router.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

module.exports = router;
