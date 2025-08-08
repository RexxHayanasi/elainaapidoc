const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Enhanced Custom Swagger UI Theme with Modern Design
const customCss = `
/* ======== ENHANCED CUSTOM SWAGGER UI THEME ======== */
:root {
  /* Color Scheme */
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
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 6px 12px rgba(108, 99, 255, 0.2);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(108, 99, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(108, 99, 255, 0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Base Styles */
body {
  background-color: var(--primary-dark) !important;
  color: var(--text-color) !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  transition: all var(--transition-speed) ease;
  scroll-behavior: smooth;
}

/* Layout Components */
.topbar {
  background-color: rgba(30, 30, 30, 0.95) !important;
  border-bottom: 1px solid var(--border-color) !important;
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.5rem;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.topbar-wrapper img {
  filter: brightness(1.2) contrast(1.1);
  height: 42px;
  transition: transform 0.3s ease;
}

.topbar-wrapper img:hover {
  transform: scale(1.05);
}

/* Navigation & Sidebar */
.scheme-container {
  background-color: var(--primary-dark) !important;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.opblock-tag {
  background-color: var(--primary-dark) !important;
  border-radius: var(--border-radius);
  margin: 0.5rem 0;
  padding: 1rem 1.25rem;
  transition: all var(--transition-speed) ease;
  border-left: 3px solid transparent;
}

.opblock-tag:hover {
  background-color: var(--primary-light) !important;
  border-left-color: var(--primary-color);
  transform: translateX(3px);
}

/* Operation Blocks */
.opblock {
  background-color: var(--primary-light) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--border-radius);
  margin: 1.5rem 0;
  box-shadow: var(--shadow);
  opacity: 0;
  transform: translateY(15px);
  animation: fadeIn 0.5s ease forwards;
  animation-delay: calc(var(--order) * 0.05s);
}

.opblock:hover {
  border-color: var(--primary-color) !important;
  box-shadow: var(--shadow-hover);
}

.opblock .opblock-summary {
  background-color: var(--primary-lighter) !important;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  padding: 1.25rem;
  transition: all var(--transition-speed) ease;
}

.opblock-summary-method {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all var(--transition-speed) ease;
}

/* HTTP Method Colors */
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

/* Response Section */
.responses-wrapper {
  background-color: var(--primary-dark) !important;
}

.responses-inner {
  padding: 1.5rem;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.response-col_status {
  color: var(--accent-color);
  font-weight: 600;
}

/* Models & Schemas */
.model-box {
  background-color: var(--primary-dark) !important;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Interactive Elements */
.execute-wrapper {
  background-color: var(--primary-light) !important;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin: 1rem 0;
}

.execute {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 600;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  transition: all var(--transition-speed) ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.execute:hover {
  background-color: var(--accent-color) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
}

.btn.authorize {
  background-color: var(--accent-color) !important;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all var(--transition-speed) ease;
}

.btn.authorize:hover {
  background-color: var(--primary-color) !important;
  transform: translateY(-2px);
}

/* Form Elements */
input, textarea, select {
  background-color: #1a1a1a !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--border-radius) !important;
  padding: 0.75rem 1rem !important;
  transition: all var(--transition-speed) ease;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.2) !important;
}

/* Code & Syntax Highlighting */
pre, code {
  background-color: #1a1a1a !important;
  color: #00ff99 !important;
  font-family: 'Fira Code', monospace;
  border-radius: var(--border-radius);
  padding: 1rem !important;
  border: 1px solid #333;
  line-height: 1.5;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-color) !important;
  font-weight: 600;
}

h1 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  position: relative;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--primary-color);
}

/* Scrollbar Styling */
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

/* Responsive Design */
@media (max-width: 768px) {
  .topbar-wrapper {
    padding: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .opblock {
    margin: 1rem 0;
  }
  
  .scheme-container {
    padding: 0.5rem;
  }
}

/* Floating Theme Toggle */
.swagger-ui .theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(108, 99, 255, 0.3);
  z-index: 9999;
  font-size: 1.5rem;
  transition: all var(--transition-speed) ease;
}

.swagger-ui .theme-toggle:hover {
  background: var(--accent-color);
  transform: scale(1.1);
  animation: pulse 1.5s infinite, float 3s ease-in-out infinite;
}

/* Loading Animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(108, 99, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

/* Tooltips */
[data-tooltip] {
  position: relative;
}

[data-tooltip]:hover::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-light);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 100;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

/* Enhanced Model Tabs */
.tab {
  background: var(--primary-light);
  border-radius: var(--border-radius) var(--border-radius) 0 0 !important;
  padding: 0.75rem 1.5rem !important;
  transition: all var(--transition-speed) ease;
}

.tab.active {
  background: var(--primary-color) !important;
  color: white !important;
}

/* Parameter Styles */
.parameters {
  border-radius: var(--border-radius);
  overflow: hidden;
}

.parameter__name {
  font-weight: 600;
  color: var(--accent-color);
}

/* Server Selection */
.servers {
  background: var(--primary-light) !important;
  border-radius: var(--border-radius);
  padding: 1rem !important;
}

/* Error Messages */
.errors-wrapper {
  background: rgba(244, 67, 54, 0.1) !important;
  border: 1px solid var(--danger-color) !important;
  border-radius: var(--border-radius);
  padding: 1rem;
}

/* Success Messages */
.success-message {
  background: rgba(76, 175, 80, 0.1) !important;
  border: 1px solid var(--success-color) !important;
  border-radius: var(--border-radius);
  padding: 1rem;
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
    tryItOutEnabled: true,
    operationsSorter: (a, b) => {
      // Sort operations by path length then alphabetically
      if (a.get("path").length !== b.get("path").length) {
        return a.get("path").length - b.get("path").length;
      }
      return a.get("path").localeCompare(b.get("path"));
    },
    tagsSorter: (a, b) => {
      // Sort tags alphabetically
      return a.localeCompare(b);
    }
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
      },
      timeout: 5000 // 5 second timeout
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
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                entry.target.style.setProperty('--order', index);
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
              }
            });
          }, { threshold: 0.1 });
          
          document.querySelectorAll('.opblock').forEach(opblock => {
            opblock.style.opacity = 0;
            opblock.style.transform = 'translateY(15px)';
            opblock.style.transition = 'all 0.5s ease';
            observer.observe(opblock);
          });
          
          // Add floating "Back to Top" button
          const backToTop = document.createElement('button');
          backToTop.innerHTML = '↑';
          backToTop.style.position = 'fixed';
          backToTop.style.bottom = '80px';
          backToTop.style.right = '20px';
          backToTop.style.zIndex = '9999';
          backToTop.style.width = '50px';
          backToTop.style.height = '50px';
          backToTop.style.borderRadius = '50%';
          backToTop.style.background = 'var(--primary-color)';
          backToTop.style.color = 'white';
          backToTop.style.border = 'none';
          backToTop.style.cursor = 'pointer';
          backToTop.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
          backToTop.style.fontSize = '20px';
          backToTop.style.display = 'none';
          backToTop.style.transition = 'all 0.3s ease';
          backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.appendChild(backToTop);
          
          window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
              backToTop.style.display = 'flex';
              backToTop.style.alignItems = 'center';
              backToTop.style.justifyContent = 'center';
            } else {
              backToTop.style.display = 'none';
            }
          });
        }
      });
      
      // Theme toggle functionality
      document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = '🌓';
        themeToggle.style.position = 'fixed';
        themeToggle.style.bottom = '20px';
        themeToggle.style.right = '20px';
        themeToggle.style.zIndex = '9999';
        themeToggle.style.width = '50px';
        themeToggle.style.height = '50px';
        themeToggle.style.borderRadius = '50%';
        themeToggle.style.background = 'var(--primary-color)';
        themeToggle.style.color = 'white';
        themeToggle.style.border = 'none';
        themeToggle.style.cursor = 'pointer';
        themeToggle.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        themeToggle.style.fontSize = '20px';
        themeToggle.style.display = 'flex';
        themeToggle.style.alignItems = 'center';
        themeToggle.style.justifyContent = 'center';
        themeToggle.style.transition = 'all 0.3s ease';
        
        themeToggle.addEventListener('click', function() {
          document.body.classList.toggle('light-mode');
          if (document.body.classList.contains('light-mode')) {
            document.documentElement.style.setProperty('--primary-dark', '#f5f5f5');
            document.documentElement.style.setProperty('--primary-light', '#ffffff');
            document.documentElement.style.setProperty('--primary-lighter', '#eeeeee');
            document.documentElement.style.setProperty('--text-color', '#333333');
            document.documentElement.style.setProperty('--text-muted', '#666666');
            document.documentElement.style.setProperty('--border-color', '#e0e0e0');
            themeToggle.innerHTML = '🌙';
          } else {
            document.documentElement.style.setProperty('--primary-dark', '#121212');
            document.documentElement.style.setProperty('--primary-light', '#1e1e1e');
            document.documentElement.style.setProperty('--primary-lighter', '#2a2a2a');
            document.documentElement.style.setProperty('--text-color', '#f0f0f0');
            document.documentElement.style.setProperty('--text-muted', '#b0b0b0');
            document.documentElement.style.setProperty('--border-color', '#333');
            themeToggle.innerHTML = '🌓';
          }
        });
        
        document.body.appendChild(themeToggle);
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
    message: "An error occurred while processing your request",
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
