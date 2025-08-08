const express = require("express");
const axios = require("axios");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Enhanced Custom Swagger UI Theme with Modern Design
const customCss = `/* ======== MODERN SWAGGER UI THEME ======== */
:root {
  /* Color Scheme */
  --primary: #6366f1;
  --primary-dark: #0f172a;
  --primary-light: #1e293b;
  --primary-lighter: #334155;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --success: #10b981;
  --info: #3b82f6;
  --warning: #f59e0b;
  --danger: #ef4444;
  --border: #475569;
  --radius: 12px;
  --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  --shadow-hover: 0 20px 25px -5px rgba(99, 102, 241, 0.2);
}

/* Modern Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Base Styles */
body {
  background: var(--primary-dark);
  color: var(--text);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  scroll-behavior: smooth;
}

/* Glassmorphism Topbar */
.topbar {
  background: rgba(30, 41, 59, 0.8) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border) !important;
  padding: 0.75rem 2rem;
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.topbar-wrapper img {
  height: 42px;
  transition: transform 0.3s ease;
}

.topbar-wrapper img:hover {
  transform: scale(1.05);
}

/* Sidebar - Modern Card Style */
.opblock-tag {
  background: var(--primary-light) !important;
  border-radius: var(--radius) !important;
  margin: 0.75rem 0;
  padding: 1.25rem !important;
  border-left: 4px solid transparent !important;
  transition: all var(--transition);
  box-shadow: var(--shadow);
}

.opblock-tag:hover {
  border-left-color: var(--primary) !important;
  transform: translateX(4px);
}

/* Operation Blocks - Neumorphic Design */
.opblock {
  background: var(--primary-light) !important;
  border: none !important;
  border-radius: var(--radius) !important;
  margin: 2rem 0 !important;
  box-shadow: 
    8px 8px 16px rgba(15, 23, 42, 0.5),
    -8px -8px 16px rgba(30, 41, 59, 0.5);
  opacity: 0;
  transform: translateY(15px);
  animation: fadeIn 0.6s ease forwards;
}

.opblock:hover {
  box-shadow: 
    12px 12px 24px rgba(15, 23, 42, 0.6),
    -12px -12px 24px rgba(30, 41, 59, 0.6);
}

.opblock .opblock-summary {
  background: var(--primary-lighter) !important;
  border-radius: var(--radius) var(--radius) 0 0 !important;
  padding: 1.25rem !important;
}

/* HTTP Method Badges - Modern Flat Design */
.opblock-summary-method {
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 80px;
  text-align: center;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: none;
  transition: all var(--transition);
}

.opblock-summary-method.GET {
  background: var(--success) !important;
}

.opblock-summary-method.POST {
  background: var(--info) !important;
}

.opblock-summary-method.PUT {
  background: var(--warning) !important;
}

.opblock-summary-method.DELETE {
  background: var(--danger) !important;
}

.opblock-summary-method.PATCH {
  background: #8b5cf6 !important;
}

/* Response Section - Modern Card */
.responses-inner {
  background: var(--primary-light) !important;
  border-radius: 0 0 var(--radius) var(--radius) !important;
  padding: 1.5rem !important;
}

/* Models - Glassmorphism Effect */
.model-box {
  background: rgba(30, 41, 59, 0.7) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  padding: 1.5rem !important;
  margin: 1.5rem 0 !important;
}

/* Buttons - Modern Flat Design */
.execute {
  background: var(--primary) !important;
  color: white !important;
  font-weight: 600;
  border-radius: var(--radius) !important;
  padding: 0.75rem 1.5rem !important;
  border: none !important;
  transition: all var(--transition) !important;
}

.execute:hover {
  background: #4f46e5 !important;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn.authorize {
  background: var(--primary) !important;
  border-radius: var(--radius) !important;
  padding: 0.75rem 1.5rem !important;
  transition: all var(--transition) !important;
}

.btn.authorize:hover {
  background: #4f46e5 !important;
  transform: translateY(-2px);
}

/* Inputs - Modern Style */
input, textarea, select {
  background: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius) !important;
  padding: 0.75rem 1rem !important;
  transition: all var(--transition) !important;
}

input:focus, textarea:focus, select:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
  outline: none;
}

/* Code Blocks - Dracula Inspired */
pre, code {
  background: #282a36 !important;
  color: #f8f8f2 !important;
  font-family: 'Fira Code', monospace;
  border-radius: var(--radius) !important;
  padding: 1.25rem !important;
  border: none !important;
}

code {
  padding: 0.3em 0.6em !important;
  background: #44475a !important;
}

/* Tables - Modern Styling */
table {
  border-radius: var(--radius) !important;
  overflow: hidden !important;
  background: var(--primary-light) !important;
  box-shadow: var(--shadow) !important;
}

th {
  background: var(--primary-lighter) !important;
  color: var(--primary) !important;
}

tr:hover {
  background: rgba(99, 102, 241, 0.05) !important;
}

/* Floating Action Button */
.swagger-ui .theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  z-index: 100;
  font-size: 1.25rem;
  transition: all var(--transition);
}

.swagger-ui .theme-toggle:hover {
  background: #4f46e5;
  transform: scale(1.1);
  animation: pulse 1.5s infinite;
}

/* Scrollbar - Modern Style */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--primary-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}

/* Responsive Design */
@media (max-width: 768px) {
  :root {
    --radius: 8px;
  }
  
  .topbar {
    padding: 0.5rem 1rem;
  }
  
  .opblock {
    margin: 1rem 0 !important;
  }
}

/* Loading Animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(99, 102, 241, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

/* Tooltips - Modern Style */
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
  color: var(--text);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 100;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

/* Parameter Styles */
.parameters {
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--primary-light);
  box-shadow: var(--shadow);
}

.parameter__name {
  font-weight: 600;
  color: var(--primary);
}

/* Server Selection - Modern Card */
.servers {
  background: var(--primary-light) !important;
  border-radius: var(--radius) !important;
  padding: 1rem !important;
  box-shadow: var(--shadow) !important;
}

/* Error Messages - Modern Alert */
.errors-wrapper {
  background: rgba(239, 68, 68, 0.1) !important;
  border: 1px solid var(--danger) !important;
  border-radius: var(--radius) !important;
  padding: 1rem;
}

/* Success Messages */
.success-message {
  background: rgba(16, 185, 129, 0.1) !important;
  border: 1px solid var(--success) !important;
  border-radius: var(--radius) !important;
  padding: 1rem;
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
