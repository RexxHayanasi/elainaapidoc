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
  /* 2025 Color Palette */
  --neon-purple: #9d4cff;
  --electric-blue: #00e5ff;
  --cyber-pink: #ff2d75;
  --matrix-green: #00ff9d;
  --deep-space: #0a0a12;
  --void-black: #050508;
  --star-light: #f0f0ff;
  --moon-dust: #b8b8cc;
  
  /* Modern Design Tokens */
  --glass-bg: rgba(20, 20, 30, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-effect: blur(16px) saturate(180%);
  --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-neon: 0 0 15px var(--neon-purple);
  --transition-3d: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  --border-radius-3d: 16px;
}

/* 2025 Font System */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');

/* Base Reset */
.swagger-ui {
  background: radial-gradient(ellipse at top, var(--deep-space), var(--void-black));
  min-height: 100vh;
  color: var(--star-light);
  font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  line-height: 1.8;
  font-size: 16px;
  letter-spacing: 0.02em;
}

/* Cyberpunk Topbar */
.swagger-ui .topbar {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-effect);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
  padding: 1rem 0;
}

.swagger-ui .topbar .title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(90deg, var(--neon-purple), var(--electric-blue));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.swagger-ui .topbar .title:before {
  content: "";
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  background: url('https://pomf2.lain.la/f/zp921a6n.jpg') center/cover;
  border-radius: 50%;
  border: 2px solid var(--neon-purple);
  box-shadow: var(--shadow-neon);
  transition: var(--transition-3d);
}

.swagger-ui .topbar .title:hover:before {
  transform: rotate(15deg) scale(1.1);
  box-shadow: 0 0 25px var(--neon-purple);
}

/* Holographic Cards */
.swagger-ui .info,
.swagger-ui .scheme-container {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-effect);
  border-radius: var(--border-radius-3d);
  padding: 2rem;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-xl);
  margin-bottom: 2rem;
  transition: var(--transition-3d);
}

.swagger-ui .info:hover,
.swagger-ui .scheme-container:hover {
  transform: translateY(-5px) rotateX(5deg);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
}

.swagger-ui .info .title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.swagger-ui .info .description {
  font-size: 1.2rem;
  color: var(--moon-dust);
}

/* Quantum Buttons */
.swagger-ui .btn {
  background: linear-gradient(135deg, var(--neon-purple), var(--cyber-pink)) !important;
  color: white !important;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 10px 30px rgba(157, 76, 255, 0.5);
  transition: var(--transition-3d);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.swagger-ui .btn:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0) 60%
  );
  transform: rotate(30deg);
  transition: all 0.7s ease;
}

.swagger-ui .btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 45, 117, 0.6);
}

.swagger-ui .btn:hover:after {
  left: 100%;
  top: 100%;
}

/* Neural Network Inputs */
.swagger-ui .scheme-container select,
.swagger-ui .scheme-container input {
  background: rgba(30, 30, 45, 0.8);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  color: var(--star-light);
  padding: 0.8rem 1.2rem;
  transition: var(--transition-3d);
  font-family: 'Space Grotesk', sans-serif;
  backdrop-filter: blur(5px);
}

.swagger-ui .scheme-container select:focus,
.swagger-ui .scheme-container input:focus {
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.3);
  outline: none;
  background: rgba(40, 40, 60, 0.9);
}

/* API Pods (Operation Blocks) */
.swagger-ui .opblock {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-effect);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-3d);
  margin-bottom: 1.5rem;
  transition: var(--transition-3d);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px) rotateX(10deg);
}

.swagger-ui .opblock.is-loaded {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

.swagger-ui .opblock:hover {
  transform: translateY(-8px) rotateX(5deg);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border-color: var(--electric-blue);
}

.swagger-ui .opblock-header {
  background: linear-gradient(90deg, var(--neon-purple), rgba(157, 76, 255, 0.7));
  color: white;
  border-radius: var(--border-radius-3d) var(--border-radius-3d) 0 0;
  padding: 1.2rem;
  font-weight: 600;
}

.swagger-ui .opblock-summary {
  font-size: 1.2rem;
}

/* Method Quantum Tags */
.swagger-ui .opblock .opblock-summary-method {
  min-width: 100px;
  padding: 0.5rem 0;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: var(--transition-3d);
}

.swagger-ui .opblock-get .opblock-summary-method {
  background: var(--electric-blue);
}

.swagger-ui .opblock-post .opblock-summary-method {
  background: var(--matrix-green);
}

.swagger-ui .opblock-put .opblock-summary-method,
.swagger-ui .opblock-patch .opblock-summary-method {
  background: var(--cyber-pink);
}

.swagger-ui .opblock-delete .opblock-summary-method {
  background: var(--neon-purple);
}

.swagger-ui .opblock .opblock-summary-path {
  font-family: 'Roboto Mono', monospace;
  font-size: 1.1rem;
}

/* Data Stream Tables */
.swagger-ui table thead tr th {
  background: linear-gradient(90deg, var(--neon-purple), var(--cyber-pink));
  color: white;
  font-weight: 600;
  border: none !important;
}

.swagger-ui table tbody tr td {
  background: rgba(40, 40, 60, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* 2025 Animations */
@keyframes hologramAppear {
  0% { opacity: 0; transform: translateY(30px) rotateX(15deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0); }
}

@keyframes quantumPulse {
  0% { box-shadow: 0 0 0 0 rgba(157, 76, 255, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(157, 76, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(157, 76, 255, 0); }
}

.swagger-ui .opblock {
  animation: hologramAppear 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.swagger-ui .btn.pulse {
  animation: quantumPulse 2s infinite;
}

/* Cyber Scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(20, 20, 30, 0.8);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(var(--neon-purple), var(--cyber-pink));
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

/* Responsive Holograms */
@media (max-width: 768px) {
  .swagger-ui .info .title {
    font-size: 2rem;
  }
  
  .swagger-ui .opblock-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .swagger-ui .topbar .title {
    font-size: 1.5rem;
  }
}

/* Neural Interface Toggle */
.swagger-ui .theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--neon-purple), var(--cyber-pink));
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(157, 76, 255, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-3d);
}

.swagger-ui .theme-toggle:hover {
  transform: rotate(180deg) scale(1.1);
  box-shadow: 0 15px 40px rgba(255, 45, 117, 0.7);
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
