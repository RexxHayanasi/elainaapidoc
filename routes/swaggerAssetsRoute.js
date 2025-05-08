const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `:root {
    --primary-color: #6c63ff;
    --secondary-color: #4a42e8;
    --accent-color: #ff6584;
    --dark-bg: #1a1a2e;
    --darker-bg: #0f0f1f;
    --card-bg: rgba(26, 26, 46, 0.95);
    --text-color: #f8f9fa;
    --text-muted: #b8c2cc;
    --border-color: rgba(108, 99, 255, 0.3);
    --success-color: #48bb78;
    --error-color: #f56565;
    --warning-color: #ed8936;
    --info-color: #4299e1;
    --transition-speed: 0.35s;
    --border-radius: 12px;
}

/* Load custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

/* Base styles */
.swagger-ui {
    background: linear-gradient(135deg, var(--darker-bg) 0%, var(--dark-bg) 100%);
    background-attachment: fixed;
    min-height: 100vh;
    color: var(--text-color);
    font-family: 'Poppins', sans-serif;
    line-height: 1.6;
    font-size: 15px;
}

/* Topbar styles */
.swagger-ui .topbar {
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%) !important;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    padding: 15px 0;
    transition: all var(--transition-speed) ease;
}

.swagger-ui .topbar .download-continue,
.swagger-ui .topbar .title,
.swagger-ui .topbar .link {
    color: var(--text-color) !important;
    font-weight: 600;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.swagger-ui .topbar .title {
    font-size: 1.6rem;
    display: flex;
    align-items: center;
    gap: 12px;
    letter-spacing: 0.5px;
}

.swagger-ui .topbar .title:before {
    content: "";
    display: inline-block;
    width: 36px;
    height: 36px;
    background-image: url('https://pomf2.lain.la/f/zp921a6n.jpg');
    background-size: cover;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    box-shadow: 0 2px 10px rgba(108, 99, 255, 0.5);
    transition: all var(--transition-speed) ease;
}

.swagger-ui .topbar .title:hover:before {
    transform: rotate(15deg) scale(1.1);
    box-shadow: 0 4px 15px rgba(108, 99, 255, 0.7);
}

/* Info and scheme containers */
.swagger-ui .info,
.swagger-ui .scheme-container {
    background: var(--card-bg) !important;
    color: var(--text-color) !important;
    border-radius: var(--border-radius);
    padding: 25px;
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    margin-bottom: 25px;
    transition: all var(--transition-speed) ease;
}

.swagger-ui .info .title {
    color: var(--primary-color) !important;
    font-size: 2.2rem;
    margin-bottom: 15px;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.swagger-ui .info .description {
    font-size: 1.15rem;
    line-height: 1.8;
    color: var(--text-muted);
}

/* Buttons */
.swagger-ui .btn {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)) !important;
    color: #fff !important;
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 600;
    border: none;
    box-shadow: 0 4px 15px rgba(108, 99, 255, 0.4);
    transition: all var(--transition-speed) ease;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
}

.swagger-ui .btn:after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
}

.swagger-ui .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(108, 99, 255, 0.6);
    background: linear-gradient(45deg, var(--secondary-color), var(--primary-color)) !important;
}

.swagger-ui .btn:hover:after {
    left: 100%;
}

/* Inputs and selects */
.swagger-ui .scheme-container select,
.swagger-ui .scheme-container input {
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: rgba(30, 30, 50, 0.9);
    color: var(--text-color);
    padding: 10px 15px;
    transition: all var(--transition-speed) ease;
    font-family: 'Poppins', sans-serif;
}

.swagger-ui .scheme-container select:focus,
.swagger-ui .scheme-container input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.3);
    outline: none;
}

/* Operation blocks */
.swagger-ui .opblock-summary-description {
    font-style: italic;
    color: var(--text-muted);
    font-size: 0.95em;
}

.swagger-ui .opblock {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 20px;
    overflow: hidden;
    transition: all var(--transition-speed) ease;
    background: var(--card-bg);
    opacity: 0;
    transform: translateY(20px);
}

.swagger-ui .opblock.is-loaded {
    opacity: 1;
    transform: translateY(0);
}

.swagger-ui .opblock:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    border-color: var(--primary-color);
}

.swagger-ui .opblock-header {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: #fff;
    border-bottom: none;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    padding: 15px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.swagger-ui .opblock-summary {
    font-weight: 600;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
}

.swagger-ui .opblock-body {
    background: rgba(30, 30, 50, 0.8);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    padding: 20px;
}

/* HTTP method tags */
.swagger-ui .opblock .opblock-summary-method {
    min-width: 90px;
    text-align: center;
    border-radius: 8px;
    font-weight: 700;
    padding: 6px 0;
    font-size: 0.85rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.swagger-ui .opblock-get .opblock-summary-method {
    background: var(--info-color);
}

.swagger-ui .opblock-post .opblock-summary-method {
    background: var(--success-color);
}

.swagger-ui .opblock-put .opblock-summary-method,
.swagger-ui .opblock-patch .opblock-summary-method {
    background: var(--warning-color);
}

.swagger-ui .opblock-delete .opblock-summary-method {
    background: var(--error-color);
}

.swagger-ui .opblock .opblock-summary-path {
    font-family: 'Fira Code', monospace;
    font-weight: 500;
    font-size: 1.1rem;
}

/* Response status */
.swagger-ui .response-col_status {
    font-weight: 700;
}

.swagger-ui .response-col_status .response-undocumented {
    opacity: 0.7;
}

/* Tabs */
.swagger-ui .tab li {
    background: rgba(30, 30, 50, 0.8);
    transition: all var(--transition-speed) ease;
}

.swagger-ui .tab li:hover {
    background: rgba(40, 40, 60, 0.9);
}

.swagger-ui .tab li.active {
    background: var(--primary-color);
    font-weight: 600;
}

/* Models */
.swagger-ui .model {
    color: var(--text-color);
}

.swagger-ui .model-title {
    color: var(--primary-color);
}

/* Tables */
.swagger-ui table {
    border-collapse: separate;
    border-spacing: 0;
}

.swagger-ui table thead tr th,
.swagger-ui table tbody tr td {
    border: 1px solid var(--border-color);
}

.swagger-ui table thead tr th {
    background: rgba(40, 40, 60, 0.9);
    color: var(--text-color);
    font-weight: 600;
}

.swagger-ui table tbody tr td {
    background: rgba(30, 30, 50, 0.7);
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(108, 99, 255, 0); }
    100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0); }
}

.swagger-ui .opblock {
    animation: fadeIn 0.6s ease forwards;
}

.swagger-ui .btn.pulse {
    animation: pulse 1.5s infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

::-webkit-scrollbar-track {
    background: rgba(30, 30, 50, 0.5);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 5px;
    transition: all var(--transition-speed) ease;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
}

/* Tooltips */
.swagger-ui .tooltip {
    background: rgba(40, 40, 60, 0.95);
    border: 1px solid var(--border-color);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

/* Loading spinner */
.swagger-ui .loading-container .loading:after {
    border-color: var(--primary-color) transparent transparent transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .swagger-ui {
        font-size: 14px;
    }
    
    .swagger-ui .info .title {
        font-size: 1.8rem;
    }
    
    .swagger-ui .info .description {
        font-size: 1rem;
    }
    
    .swagger-ui .opblock-summary {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .swagger-ui .opblock-summary-method {
        margin-right: 0;
        margin-bottom: 8px;
    }
    
    .swagger-ui .topbar .title {
        font-size: 1.3rem;
    }
    
    .swagger-ui .topbar .title:before {
        width: 28px;
        height: 28px;
    }
}

/* Dark mode toggle animation */
.swagger-ui .theme-toggle {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.swagger-ui .theme-toggle:hover {
    transform: rotate(180deg) scale(1.1);
}`;

// Enhanced Swagger UI options
const swaggerOptions = {
  customCss,
  customSiteTitle: "Elaina API Documentation",
  customfavIcon: "https://files.catbox.moe/hbnnzs.jpg_",
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
