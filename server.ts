import express from "express";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  
  // Safely grab the port Google Cloud provides, or default to 3000 for AI Studio
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  // API Proxy to bypass CORS issues
  app.use(
    "/api/flights",
    createProxyMiddleware({
      target: "https://trawell-flights-api-675187781044.asia-south1.run.app",
      changeOrigin: true,
      secure: true,
    })
  );

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Strictly rely on NODE_ENV so we don't break the AI Studio preview
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    console.log("Starting Vite in Development Mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting Express in Production Mode...");
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    
    // The Catch-All for React Router (Express 5 Safe Regex)
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();