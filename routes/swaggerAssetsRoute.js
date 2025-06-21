const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `/* ======== ENHANCED CUSTOM SWAGGER UI DARK THEME ======== */
:root {
  --primary-color: #6c63ff;
  --primary-dark: #121212;
  --primary-light: #1e1e1e;
  --primary-lighter: #2a2a2a;
  --text-color: #f0f0f0;
  --text-muted: #b0b0b0;
  --accent-color: #8a85ff;
  --success-color: #4caf50;
  --info-color: #2196f3;
  --warning-color: #ff9800;
  --danger-color: #f44336;
  --border-color: #333;
  --border-radius: 8px;
  --transition-speed: 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(108, 99, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0); }
}

body {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  transition: background-color var(--transition-speed) ease;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Navbar */
.topbar {
  background-color: rgba(30, 30, 30, 0.9) !important;
  border-bottom: 1px solid var(--border-color) !important;
  backdrop-filter: blur(8px);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  transition: all var(--transition-speed) ease;
}

.topbar-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-wrapper img {
  filter: brightness(1.2) contrast(1.1);
  height: 40px;
  transition: transform 0.3s ease;
}

.topbar-wrapper img:hover {
  transform: scale(1.05);
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
  transition: all var(--transition-speed) ease;
}

.opblock-tag {
  border-bottom: 1px solid var(--border-color) !important;
  font-weight: 600;
  padding: 1rem;
  margin: 0;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
}

.opblock-tag:hover {
  background-color: var(--primary-light) !important;
  transform: translateX(5px);
}

/* Paths & Operations */
.opblock {
  background-color: var(--primary-light) !important;
  border: 1px solid var(--border-color) !important;
  margin: 1.5rem 0;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s ease forwards;
  transition: all var(--transition-speed) ease;
}

.opblock:hover {
  border-color: var(--primary-color) !important;
  box-shadow: 0 6px 16px rgba(108, 99, 255, 0.2);
}

.opblock .opblock-summary {
  background-color: var(--primary-lighter) !important;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  transition: all var(--transition-speed) ease;
}

.opblock-summary-method {
  color: white !important;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 4px;
  margin-right: 10px;
  min-width: 80px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all var(--transition-speed) ease;
}

.opblock-summary-method.GET {
  background-color: var(--success-color) !important;
}

.opblock-summary-method.POST {
  background-color: var(--info-color) !important;
}

.opblock-summary-method.PUT {
  background-color: var(--warning-color) !important;
}

.opblock-summary-method.DELETE {
  background-color: var(--danger-color) !important;
}

.opblock-summary-method.PATCH {
  background-color: #9c27b0 !important;
}

.opblock-summary-method.HEAD,
.opblock-summary-method.OPTIONS {
  background-color: #607d8b !important;
}

/* Response section */
.responses-wrapper,
.responses-inner,
.response-col_status {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
}

.responses-inner {
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.response-col_status {
  font-weight: bold;
  color: var(--accent-color);
}

.model-box {
  background-color: var(--primary-dark) !important;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Try it out & Execute */
.execute-wrapper,
.try-out {
  background-color: var(--primary-light) !important;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem 0;
}

.execute {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: bold;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  transition: all var(--transition-speed) ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.execute:hover {
  background-color: var(--accent-color) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 99, 255, 0.3);
}

.cancel {
  background-color: #555 !important;
  color: #eee !important;
  font-weight: bold;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  transition: all var(--transition-speed) ease;
}

.cancel:hover {
  background-color: #666 !important;
}

.btn.authorize {
  background-color: var(--accent-color) !important;
  color: white !important;
  border: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--border-radius);
  transition: all var(--transition-speed) ease;
}

.btn.authorize:hover {
  background-color: var(--primary-color) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(108, 99, 255, 0.3);
}

.btn.authorize svg {
  fill: white !important;
}

/* Inputs */
textarea,
input[type="text"],
input[type="email"],
input[type="url"],
input[type="password"],
select {
  background-color: #1a1a1a !important;
  color: var(--text-color) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--border-radius) !important;
  padding: 8px 12px !important;
  transition: all var(--transition-speed) ease;
}

textarea:focus,
input[type="text"]:focus,
input[type="email"]:focus,
input[type="url"]:focus,
input[type="password"]:focus,
select:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2) !important;
  outline: none;
}

/* Code blocks */
pre,
code {
  background-color: #1a1a1a !important;
  color: #00ff99 !important;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  border-radius: var(--border-radius);
  padding: 1rem !important;
  border: 1px solid #333;
  line-height: 1.5;
  overflow-x: auto;
}

code {
  padding: 0.2em 0.4em !important;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  background-color: var(--primary-light);
  border-radius: var(--border-radius);
  overflow: hidden;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--primary-lighter);
  color: var(--accent-color);
  font-weight: 600;
}

tr:hover {
  background-color: rgba(108, 99, 255, 0.05);
}

/* General typography */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-color) !important;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
}

h1 {
  font-size: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

h2 {
  font-size: 1.75rem;
}

h3 {
  font-size: 1.5rem;
}

label,
span,
p {
  color: var(--text-color) !important;
}

a {
  color: var(--accent-color) !important;
  text-decoration: none;
  transition: color var(--transition-speed) ease;
}

a:hover {
  color: var(--primary-color) !important;
  text-decoration: underline;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--primary-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}

/* Loading animation */
.loading:after {
  content: ' .';
  animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
  0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  40% { color: var(--text-color); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  60% { text-shadow: .25em 0 0 var(--text-color), .5em 0 0 rgba(0,0,0,0); }
  80%, 100% { text-shadow: .25em 0 0 var(--text-color), .5em 0 0 var(--text-color); }
}

/* Tooltips */
[data-title] {
  position: relative;
  cursor: help;
}

[data-title]:hover::after {
  content: attr(data-title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--primary-light);
  color: var(--text-color);
  padding: 5px 10px;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 100;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

/* Dark/Light mode toggle */
.swagger-ui .theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all var(--transition-speed) ease;
}

.swagger-ui .theme-toggle:hover {
  background: var(--accent-color);
  transform: scale(1.1);
  animation: pulse 1.5s infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .topbar-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .opblock {
    margin: 1rem 0;
  }
  
  .scheme-container {
    padding: 0.5rem;
  }
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
