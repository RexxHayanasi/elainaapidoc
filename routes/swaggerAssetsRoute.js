const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `/* ======== CUSTOM SWAGGER UI DARK THEME ======== */
:root {
  --primary-color: #58a6ff;
  --primary-dark: #1f1f1f;
  --primary-light: #2c2c2c;
  --text-color: #e0e0e0;
  --text-muted: #aaaaaa;
  --accent-color: #79c0ff;
}

body {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
}

/* Navbar */
.topbar {
  background-color: var(--primary-light) !important;
  border-bottom: 1px solid #333 !important;
  backdrop-filter: blur(6px);
}

.topbar-wrapper img {
  filter: brightness(1.2) contrast(1.1);
  height: 40px;
}

/* Sidebar Menu */
.scheme-container,
.scheme-container .schemes,
.opblock-tag-section,
.opblock-tag,
.opblock-summary,
.opblock-summary-description {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
}

.opblock-tag {
  border-bottom: 1px solid #333 !important;
  font-weight: 600;
}

.opblock-tag:hover {
  background-color: var(--primary-light);
}

/* Paths & Operations */
.opblock {
  background-color: var(--primary-light) !important;
  border: 1px solid #333 !important;
  margin: 1rem 0;
  border-radius: 8px;
}

.opblock .opblock-summary {
  background-color: var(--primary-dark) !important;
  border-bottom: 1px solid #444;
}

.opblock-summary-method {
  color: white !important;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 4px;
  margin-right: 10px;
}

.opblock-summary-method.GET {
  background-color: #2e7d32 !important;
}

.opblock-summary-method.POST {
  background-color: #1565c0 !important;
}

.opblock-summary-method.PUT {
  background-color: #ef6c00 !important;
}

.opblock-summary-method.DELETE {
  background-color: #c62828 !important;
}

/* Response section */
.responses-wrapper,
.responses-inner,
.response-col_status {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
}

.responses-inner {
  border-top: 1px solid #444;
  padding-top: 1rem;
}

.response-col_status {
  font-weight: bold;
}

.model-box {
  background-color: var(--primary-dark) !important;
  color: var(--text-color);
  border: 1px solid #444;
  border-radius: 6px;
  padding: 1rem;
}

/* Try it out & Execute */
.execute-wrapper,
.try-out {
  background-color: var(--primary-light) !important;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 1rem;
}

.execute {
  background-color: var(--primary-color) !important;
  color: black !important;
  font-weight: bold;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
}

.cancel {
  background-color: #555 !important;
  color: #eee !important;
  font-weight: bold;
  border-radius: 5px;
  padding: 6px 12px;
  cursor: pointer;
}

.btn.authorize {
  background-color: var(--accent-color) !important;
  color: black !important;
  border: none;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
}

/* Inputs */
textarea,
input[type="text"],
input[type="email"],
input[type="url"] {
  background-color: #1e1e1e !important;
  color: var(--text-color) !important;
  border: 1px solid #444;
  border-radius: 6px;
}

/* Code blocks */
pre,
code {
  background-color: #1e1e1e !important;
  color: #00ff99 !important;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  border-radius: 6px;
  padding: 0.5rem;
}

/* General typography */
h1, h2, h3, h4, h5, h6,
label,
span,
p {
  color: var(--text-color) !important;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}`;

// Enhanced Swagger UI options
const swaggerOptions = {
  customCss,
  customSiteTitle: "Elaina API Documentation",
  customfavIcon: "https://files.catbox.moe/hbnnzs.jpg",
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true,
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 1,
    persistAuthorization: true,
    syntaxHighlight: {
      activate: true,
      theme: 'arta'
    },
    tryItOutEnabled: true
  }
};

// Serve Swagger UI with custom options
router.get("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Cache for assets
const assetCache = new Map();

// Improved asset fetching with caching
const fetchAsset = async (url, contentType) => {
  if (assetCache.has(url)) {
    return assetCache.get(url);
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': contentType,
        'Cache-Control': 'public, max-age=86400' // 1 day cache
      }
    });
    assetCache.set(url, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset from ${url}:`, error.message);
    throw error;
  }
};

// Asset routes with error handling and caching
const serveAsset = (url, contentType) => async (req, res) => {
  try {
    const data = await fetchAsset(url, contentType);
    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400' // 1 day cache
    });
    res.send(data);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load asset",
      details: error.message
    });
  }
};

// Define assets with fallback URLs
const assets = {
  "/swagger-ui.css": {
    url: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css",
    fallback: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    contentType: "text/css"
  },
  "/swagger-ui-bundle.js": {
    url: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-bundle.js",
    fallback: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
    contentType: "application/javascript"
  },
  "/swagger-ui-standalone-preset.js": {
    url: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-standalone-preset.js",
    fallback: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    contentType: "application/javascript"
  }
};

// Setup asset routes with fallback handling
Object.entries(assets).forEach(([route, { url, fallback, contentType }]) => {
  router.get(route, async (req, res) => {
    try {
      const data = await fetchAsset(url, contentType);
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });
      res.send(data);
    } catch (primaryError) {
      console.log(`Falling back to alternative URL for ${route}`);
      try {
        const fallbackData = await fetchAsset(fallback, contentType);
        res.set({
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400'
        });
        res.send(fallbackData);
      } catch (fallbackError) {
        res.status(500).json({
          error: "Failed to load asset from both primary and fallback sources",
          details: {
            primaryError: primaryError.message,
            fallbackError: fallbackError.message
          }
        });
      }
    }
  });
});

// Custom initialization script
router.get("/swagger-ui-init.js", (req, res) => {
  res.set({
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=86400'
  });
  
  res.send(`
    window.onload = function() {
      // Custom initialization with enhanced options
      const ui = SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true,
        defaultModelRendering: 'model',
        validatorUrl: null,
        oauth2RedirectUrl: window.location.origin + '/oauth2-redirect.html',
        onComplete: function() {
          // Add custom logo to the topbar
          const logo = document.createElement('div');
          logo.innerHTML = '<img src="https://pomf2.lain.la/f/zp921a6n.jpg" style="height: 40px; border-radius: 50%; margin-right: 10px; border: 2px solid #6c63ff;">';
          document.querySelector('.topbar-wrapper').prepend(logo);
          
          // Add animation to operation blocks
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
              }
            });
          }, { threshold: 0.1 });
          
          document.querySelectorAll('.opblock').forEach(opblock => {
            opblock.style.opacity = 0;
            opblock.style.transform = 'translateY(20px)';
            opblock.style.transition = 'all 0.5s ease';
            observer.observe(opblock);
          });
        }
      });
      
      // Enable dark mode by default
      document.body.classList.add('swagger-dark-mode');
      
      // Add custom theme toggle button
      const themeToggle = document.createElement('div');
      themeToggle.innerHTML = '<button id="theme-toggle" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; background: #6c63ff; color: white; border: none; border-radius: 50%; width: 50px; height: 50px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">🌓</button>';
      document.body.appendChild(themeToggle);
      
      document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('swagger-dark-mode');
      });
    };
  `);
});

// Serve swagger.json with caching
router.get("/swagger.json", (req, res) => {
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600' // 1 hour cache
  });
  res.json(swaggerDocument);
});

// Error handling middleware for Swagger routes
router.use((err, req, res, next) => {
  console.error('Swagger UI error:', err);
  res.status(500).json({
    error: "Internal Server Error",
    message: "An error occurred while processing your request"
  });
});

module.exports = router;
