const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const router = express.Router();

// CSS kustom untuk Swagger UI
const customCss = `
    .swagger-ui {
        background-image: url('https://example.com/your-custom-background.jpg'); /* Ganti URL ini dengan gambar latar belakang Anda */
        background-size: cover;
        background-position: center;
    }
    .swagger-ui .topbar {
        background: rgba(0, 0, 0, 0.8) !important;
        border-bottom: 2px solid #007bff;
    }
    .swagger-ui .topbar .download-continue,
    .swagger-ui .topbar .title,
    .swagger-ui .topbar .link {
        color: #e0e0e0 !important;
    }
    .swagger-ui .info,
    .swagger-ui .scheme-container {
        background: rgba(0, 0, 0, 0.6) !important;
        color: #e0e0e0 !important;
        border-radius: 8px;
        padding: 10px;
    }
    .swagger-ui .btn {
        background-color: #007bff !important;
        color: #fff !important;
        border-radius: 4px;
        padding: 8px 16px;
        font-weight: bold;
    }
    .swagger-ui .btn:hover {
        background-color: #0056b3 !important;
    }
    .swagger-ui .scheme-container select,
    .swagger-ui .scheme-container input {
        border-radius: 4px;
        border: 1px solid #007bff;
        background-color: #333;
        color: #fff;
    }
    .swagger-ui .opblock-summary-description {
        font-style: italic;
    }
    .swagger-ui .opblock {
        border: 1px solid #007bff;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    .swagger-ui .opblock-header {
        background: #007bff;
        color: #fff;
        border-bottom: 1px solid #0056b3;
    }
    .swagger-ui .opblock-summary {
        font-weight: bold;
    }
    .swagger-ui .opblock-body {
        background: rgba(0, 0, 0, 0.4);
    }
`;

// Menyajikan dokumentasi Swagger dengan CSS kustom
router.get(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);

// Middleware untuk mengambil aset Swagger UI
const ambilAset = async (url, jenisKonten, res) => {
  try {
    const response = await axios.get(url);
    res.set("Content-Type", jenisKonten);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Terjadi kesalahan saat mengambil aset");
  }
};

router.get("/swagger-ui.css", (req, res) => {
  ambilAset("https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui.min.css", "text/css", res);
});

router.get("/swagger-ui-bundle.js", (req, res) => {
  ambilAset("https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui-bundle.min.js", "application/javascript", res);
});

router.get("/swagger-ui-standalone-preset.js", (req, res) => {
  ambilAset("https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui-standalone-preset.min.js", "application/javascript", res);
});

router.get("/swagger-ui-init.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(`window.onload = function () {
    SwaggerUIBundle({
      url: "/swagger.json",
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: "BaseLayout",
      deepLinking: true,
      validatorUrl: null, // Disable validator URL if not needed
    });
  };`);
});

// Middleware untuk menyembunyikan /swagger.json
router.use((req, res, next) => {
  if (req.path === "/swagger.json") {
    res.status(404).send("Tidak ditemukan");
  } else {
    next();
  }
});

// Rute untuk menampilkan swagger.json jika diperlukan
router.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

module.exports = router;
