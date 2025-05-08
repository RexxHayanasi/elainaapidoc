const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `/* ------------------------------------
   Root Variables
------------------------------------ */
:root {
  --primary-color: #6c63ff;
  --secondary-color: #4a42e8;
  --accent-color: #ff6584;

  --dark-bg: #1a1a2e;
  --card-bg: rgba(26, 26, 46, 0.9);
  --input-bg: rgba(30, 30, 50, 0.8);

  --text-color: #f8f9fa;
  --border-color: rgba(108, 99, 255, 0.3);

  --font-main: 'Poppins', sans-serif;
  --font-mono: 'Fira Code', monospace;

  --spacing-sm: 10px;
  --spacing-md: 20px;

  --radius-sm: 6px;
  --radius-md: 12px;

  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.2);
  --shadow-btn: 0 4px 10px rgba(108, 99, 255, 0.3);
  --shadow-btn-hover: 0 6px 15px rgba(108, 99, 255, 0.4);
}

/* ------------------------------------
   Base Styles
------------------------------------ */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

* {
  transition: all 0.2s ease-in-out;
}

body.swagger-dark-mode {
  background: var(--dark-bg);
  color: var(--text-color);
}

.swagger-ui {
  background: linear-gradient(135deg, #16213e, var(--dark-bg));
  min-height: 100vh;
  font-family: var(--font-main);
  color: var(--text-color);
}

/* ------------------------------------
   Topbar
------------------------------------ */
.swagger-ui .topbar {
  background: rgba(0, 0, 0, 0.7);
  border-bottom: 2px solid var(--primary-color);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  padding: var(--spacing-sm) 0;
  backdrop-filter: blur(10px);
}

.swagger-ui .topbar .title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 10px;
}

.swagger-ui .topbar .title::before {
  content: "";
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url('https://pomf2.lain.la/f/zp921a6n.jpg');
  background-size: cover;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
}

/* ------------------------------------
   Info & Scheme Container
------------------------------------ */
.swagger-ui .info,
.swagger-ui .scheme-container {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-card);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.swagger-ui .info .title {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.swagger-ui .info .description {
  font-size: 1.1rem;
  line-height: 1.6;
}

/* ------------------------------------
   Buttons
------------------------------------ */
.swagger-ui .btn {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-btn);
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
}

.swagger-ui .btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-btn-hover);
  background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
}

/* ------------------------------------
   Inputs & Selects
------------------------------------ */
.swagger-ui .scheme-container select,
.swagger-ui .scheme-container input {
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

.swagger-ui .scheme-container input:focus,
.swagger-ui .scheme-container select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
}

/* ------------------------------------
   Opblock (Endpoint Cards)
------------------------------------ */
.swagger-ui .opblock {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  animation: fadeIn 0.5s ease forwards;
}

.swagger-ui .opblock:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-color);
}

.swagger-ui .opblock-header {
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  color: #fff;
  padding: 12px;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.swagger-ui .opblock-summary {
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.swagger-ui .opblock-summary-method {
  min-width: 80px;
  text-align: center;
  border-radius: var(--radius-sm);
  font-weight: 600;
  padding: 5px 0;
}

.swagger-ui .opblock-summary-path {
  font-family: var(--font-mono);
}

.swagger-ui .opblock-body {
  background: rgba(30, 30, 50, 0.7);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  padding: 15px;
}

.swagger-ui .opblock-summary-description {
  font-style: italic;
  color: #aaa;
}

/* ------------------------------------
   Tab & Status
------------------------------------ */
.swagger-ui .tab li {
  background: rgba(30, 30, 50, 0.7);
}

.swagger-ui .tab li.active {
  background: var(--primary-color);
}

.swagger-ui .response-col_status {
  font-weight: 600;
}

/* ------------------------------------
   Animation
------------------------------------ */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ------------------------------------
   Scrollbar
------------------------------------ */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(30, 30, 50, 0.5);
}
::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

/* ------------------------------------
   Responsive
------------------------------------ */
@media (max-width: 768px) {
  .swagger-ui .info .title {
    font-size: 1.5rem;
  }

  .swagger-ui .opblock-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .swagger-ui .opblock-summary-method {
    margin-bottom: 5px;
  }
}

@media (max-width: 480px) {
  .swagger-ui .topbar .title {
    font-size: 1.2rem;
  }

  .swagger-ui .btn {
    padding: 8px 12px;
    font-size: 0.75rem;
  }
}
`;

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
