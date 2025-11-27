import express from 'express';
import { Request, Response } from 'express';
import searchRoutes from './searchRoutes';
import urlRoutes from './urlRoutes';

const router = express.Router();

// Root path response
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Your Website!");
});

router.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

// Description: Health check endpoint for monitoring and deployment verification
// Endpoint: GET /api/health
// Request: {}
// Response: { status: string, message: string, timestamp: string, uptime: number }
router.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    message: "StreamRateHub API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Search routes
router.use("/api/search", searchRoutes);

// URL management routes
router.use("/api", urlRoutes);

export default router;