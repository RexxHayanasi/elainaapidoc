const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Custom Swagger UI theme with dark mode and animations
const customCss = `
    :root {
        --primary-color: #6c63ff;
        --secondary-color: #4a42e8;
        --accent-color: #ff6584;
        --dark-bg: #1a1a2e;
        --card-bg: rgba(26, 26, 46, 0.9);
        --text-color: #f8f9fa;
        --border-color: rgba(108, 99, 255, 0.3);
    }
    
    .swagger-ui {
        background: linear-gradient(135deg, #16213e 0%, var(--dark-bg) 100%);
        background-attachment: fixed;
        min-height: 100vh;
        color: var(--text-color);
        font-family: 'Poppins', sans-serif;
    }
    
    /* Load custom font */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
    
    .swagger-ui .topbar {
        background: rgba(0, 0, 0, 0.7) !important;
        backdrop-filter: blur(10px);
        border-bottom: 2px solid var(--primary-color);
        box-shadow: 0 2px 20px rgba(0,0,0,0.3);
        padding: 10px 0;
    }
    
    .swagger-ui .topbar .download-continue,
    .swagger-ui .topbar .title,
    .swagger-ui .topbar .link {
        color: var(--text-color) !important;
        font-weight: 500;
    }
    
    .swagger-ui .topbar .title {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .swagger-ui .topbar .title:before {
        content: "";
        display: inline-block;
        width: 30px;
        height: 30px;
        background-image: url('https://pomf2.lain.la/f/zp921a6n.jpg');
        background-size: cover;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
    }
    
    .swagger-ui .info,
    .swagger-ui .scheme-container {
        background: var(--card-bg) !important;
        color: var(--text-color) !important;
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        backdrop-filter: blur(5px);
        margin-bottom: 20px;
    }
    
    .swagger-ui .info .title {
        color: var(--primary-color) !important;
        font-size: 2rem;
        margin-bottom: 10px;
    }
    
    .swagger-ui .info .description {
        font-size: 1.1rem;
        line-height: 1.6;
    }
    
    .swagger-ui .btn {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)) !important;
        color: #fff !important;
        border-radius: 6px;
        padding: 10px 20px;
        font-weight: 600;
        border: none;
        box-shadow: 0 4px 10px rgba(108, 99, 255, 0.3);
        transition: all 0.3s ease;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
    }
    
    .swagger-ui .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(108, 99, 255, 0.4);
        background: linear-gradient(45deg, var(--secondary-color), var(--primary-color)) !important;
    }
    
    .swagger-ui .scheme-container select,
    .swagger-ui .scheme-container input {
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background-color: rgba(30, 30, 50, 0.8);
        color: var(--text-color);
        padding: 8px 12px;
        transition: all 0.3s ease;
    }
    
    .swagger-ui .scheme-container select:focus,
    .swagger-ui .scheme-container input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2);
    }
    
    .swagger-ui .opblock-summary-description {
        font-style: italic;
        color: #aaa;
    }
    
    .swagger-ui .opblock {
        border: 1px solid var(--border-color);
        border-radius: 12px;
        margin-bottom: 15px;
        overflow: hidden;
        transition: all 0.3s ease;
        background: var(--card-bg);
    }
    
    .swagger-ui .opblock:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border-color: var(--primary-color);
    }
    
    .swagger-ui .opblock-header {
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        color: #fff;
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        padding: 12px;
    }
    
    .swagger-ui .opblock-summary {
        font-weight: 600;
        font-size: 1.1rem;
    }
    
    .swagger-ui .opblock-body {
        background: rgba(30, 30, 50, 0.7);
        border-radius: 0 0 12px 12px;
        padding: 15px;
    }
    
    .swagger-ui .opblock .opblock-summary-method {
        min-width: 80px;
        text-align: center;
        border-radius: 6px;
        font-weight: 600;
        padding: 5px 0;
    }
    
    .swagger-ui .opblock .opblock-summary-path {
        font-family: 'Fira Code', monospace;
    }
    
    .swagger-ui .response-col_status {
        font-weight: 600;
    }
    
    .swagger-ui .tab li {
        background: rgba(30, 30, 50, 0.7);
    }
    
    .swagger-ui .tab li.active {
        background: var(--primary-color);
    }
    
    /* Animation for loading */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .swagger-ui .opblock {
        animation: fadeIn 0.5s ease forwards;
    }
    
    /* Custom scrollbar */
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
    
    /* Responsive adjustments */
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
`;

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
