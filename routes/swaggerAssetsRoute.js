const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `:root {
    /* Modern Color Palette */
    --primary-color: #7c4dff;  /* More vibrant purple */
    --secondary-color: #5e35b1;  /* Deeper purple */
    --accent-color: #ff4081;  /* Vibrant pink */
    --dark-bg: #121212;  /* True dark mode background */
    --darker-bg: #0a0a0a;
    --card-bg: rgba(30, 30, 40, 0.95);
    --text-color: #ffffff;
    --text-muted: #b0b0b0;
    --border-color: rgba(124, 77, 255, 0.4);
    --success-color: #00c853;  /* Brighter green */
    --error-color: #ff1744;  /* Brighter red */
    --warning-color: #ff9100;  /* Vibrant orange */
    --info-color: #00b0ff;  /* Bright blue */
    --transition-speed: 0.4s;
    --border-radius: 14px;
    --glow-effect: 0 0 15px rgba(124, 77, 255, 0.6);
}

/* Load modern fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Base styles with modern touch */
.swagger-ui {
    background: radial-gradient(circle at top right, #1a1a2e 0%, #121212 100%);
    background-attachment: fixed;
    min-height: 100vh;
    color: var(--text-color);
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    font-size: 16px;
}

/* Modern topbar with glass morphism effect */
.swagger-ui .topbar {
    background: rgba(18, 18, 18, 0.85) !important;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    padding: 15px 0;
    transition: all var(--transition-speed) ease;
}

.swagger-ui .topbar .title {
    font-size: 1.7rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
    gap: 15px;
}

.swagger-ui .topbar .title:before {
    content: "";
    display: inline-block;
    width: 40px;
    height: 40px;
    background-image: url('https://pomf2.lain.la/f/zp921a6n.jpg');
    background-size: cover;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    box-shadow: var(--glow-effect);
    transition: all var(--transition-speed) cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.swagger-ui .topbar .title:hover:before {
    transform: rotate(20deg) scale(1.1);
    box-shadow: 0 0 20px rgba(124, 77, 255, 0.8);
}

/* Modern card design with glass effect */
.swagger-ui .info,
.swagger-ui .scheme-container {
    background: rgba(30, 30, 40, 0.8) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: var(--border-radius);
    padding: 30px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    margin-bottom: 30px;
    transition: all var(--transition-speed) ease;
}

.swagger-ui .info:hover,
.swagger-ui .scheme-container:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
    border-color: var(--accent-color);
}

.swagger-ui .info .title {
    font-size: 2.4rem;
    margin-bottom: 20px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.2;
}

.swagger-ui .info .description {
    font-size: 1.2rem;
    line-height: 1.8;
    color: var(--text-muted);
}

/* Modern buttons with hover effects */
.swagger-ui .btn {
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color)) !important;
    color: white !important;
    border-radius: 10px;
    padding: 14px 28px;
    font-weight: 600;
    border: none;
    box-shadow: 0 5px 20px rgba(124, 77, 255, 0.5);
    transition: all var(--transition-speed) cubic-bezier(0.25, 0.8, 0.25, 1);
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1.2px;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.swagger-ui .btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--accent-color), var(--primary-color));
    z-index: -1;
    opacity: 0;
    transition: all var(--transition-speed) ease;
}

.swagger-ui .btn:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 10px 30px rgba(255, 64, 129, 0.6);
}

.swagger-ui .btn:hover:before {
    opacity: 1;
}

/* Modern input fields */
.swagger-ui .scheme-container select,
.swagger-ui .scheme-container input {
    border-radius: 10px;
    border: 1px solid var(--border-color);
    background: rgba(40, 40, 50, 0.8);
    color: var(--text-color);
    padding: 12px 18px;
    transition: all var(--transition-speed) ease;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    backdrop-filter: blur(5px);
}

.swagger-ui .scheme-container select:focus,
.swagger-ui .scheme-container input:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(255, 64, 129, 0.3);
    outline: none;
    background: rgba(50, 50, 60, 0.9);
}

/* Modern operation blocks */
.swagger-ui .opblock {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 25px;
    overflow: hidden;
    transition: all var(--transition-speed) cubic-bezier(0.25, 0.8, 0.25, 1);
    background: rgba(35, 35, 45, 0.9);
    backdrop-filter: blur(5px);
    opacity: 0;
    transform: translateY(20px);
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
}

.swagger-ui .opblock.is-loaded {
    opacity: 1;
    transform: translateY(0);
}

.swagger-ui .opblock:hover {
    transform: translateY(-7px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    border-color: var(--accent-color);
}

.swagger-ui .opblock-header {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-bottom: none;
    padding: 18px;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.swagger-ui .opblock-summary {
    font-size: 1.2rem;
}

/* HTTP method tags with modern look */
.swagger-ui .opblock .opblock-summary-method {
    min-width: 100px;
    padding: 8px 0;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
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
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.1rem;
}

/* Modern tabs */
.swagger-ui .tab li {
    background: rgba(40, 40, 50, 0.8);
    transition: all var(--transition-speed) ease;
    border-radius: 8px 8px 0 0;
}

.swagger-ui .tab li:hover {
    background: rgba(50, 50, 60, 0.9);
}

.swagger-ui .tab li.active {
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    font-weight: 600;
}

/* Modern tables */
.swagger-ui table thead tr th {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: white;
    font-weight: 600;
    border: none !important;
}

.swagger-ui table tbody tr td {
    background: rgba(40, 40, 50, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* Modern animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
}

.swagger-ui .opblock {
    animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.swagger-ui .btn.pulse {
    animation: float 3s ease-in-out infinite;
}

/* Modern scrollbar */
::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    background: rgba(20, 20, 30, 0.8);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: linear-gradient(var(--primary-color), var(--accent-color));
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
}

/* Modern tooltips */
.swagger-ui .tooltip {
    background: rgba(50, 50, 60, 0.95);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    padding: 12px;
    font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
    .swagger-ui .info .title {
        font-size: 2rem;
    }
    
    .swagger-ui .opblock-summary {
        flex-direction: column;
        gap: 12px;
    }
    
    .swagger-ui .opblock-summary-method {
        width: 100%;
    }
}

/* Theme toggle button */
.swagger-ui .theme-toggle {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 5px 25px rgba(124, 77, 255, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.swagger-ui .theme-toggle:hover {
    transform: rotate(180deg) scale(1.1);
    box-shadow: 0 8px 30px rgba(255, 64, 129, 0.7);
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
