import express, { Request, Response } from 'express';

const router = express.Router();

// Helper function to get the actual public URL from the request
// This handles proxies and forwarded headers properly
function getPublicUrl(req: Request): string {
  // Check for forwarded protocol and host (common in proxies)
  const forwardedProto = req.get('x-forwarded-proto');
  const forwardedHost = req.get('x-forwarded-host');

  // Check for original host (some proxies use this)
  const originalHost = req.get('x-original-host');

  // Check for Pythagora-specific headers
  const pythagoraHost = req.get('x-pythagora-host');

  // Determine the protocol
  let protocol = forwardedProto || req.protocol || 'https';
  // Remove any trailing characters from protocol
  protocol = protocol.split(',')[0].trim();

  // Determine the host - priority order:
  // 1. Pythagora-specific header
  // 2. Forwarded host
  // 3. Original host
  // 4. Standard host header
  // 5. Hardcoded fallback for Pythagora environment
  let host = pythagoraHost || forwardedHost || originalHost || req.get('host');

  // If we're still on localhost but have forwarded headers, use the Pythagora URL
  if (host === 'localhost:3000' && (forwardedProto || forwardedHost)) {
    host = 'preview-0ag1onvs.ui.pythagora.ai';
    protocol = 'https';
  }

  // Fallback to known deployment URL if we detect localhost in production-like environment
  if (host?.includes('localhost') && process.env.NODE_ENV !== 'development') {
    host = 'preview-0ag1onvs.ui.pythagora.ai';
    protocol = 'https';
  }

  const publicUrl = `${protocol}://${host}`;

  console.log(`[URL Detection] Protocol: ${protocol}, Host: ${host}, Final URL: ${publicUrl}`);
  console.log(`[URL Detection] Headers - X-Forwarded-Proto: ${forwardedProto}, X-Forwarded-Host: ${forwardedHost}, Host: ${req.get('host')}`);

  return publicUrl;
}

// Description: Get current deployment URL information
// Endpoint: GET /api/url-info
// Request: {}
// Response: { currentUrl: string, environment: string, timestamp: string, isHealthy: boolean }
router.get('/url-info', (req: Request, res: Response) => {
  try {
    console.log('[URL Info] Fetching deployment URL information');

    const currentUrl = getPublicUrl(req);
    const environment = process.env.NODE_ENV || 'development';

    const urlInfo = {
      currentUrl,
      environment,
      timestamp: new Date().toISOString(),
      isHealthy: true,
      deploymentId: process.env.DEPLOYMENT_ID || 'unknown',
      apiBase: `${currentUrl}/api`,
    };

    console.log('[URL Info] Successfully retrieved:', urlInfo);
    res.status(200).json(urlInfo);
  } catch (error) {
    console.error('[URL Info] Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve URL information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Description: Verify if the application is accessible from the correct URL
// Endpoint: GET /api/verify-url
// Request: { expectedUrl?: string }
// Response: { isCorrectUrl: boolean, currentUrl: string, expectedUrl: string, message: string }
router.get('/verify-url', (req: Request, res: Response) => {
  try {
    const currentUrl = getPublicUrl(req);
    const expectedUrl = req.query.expectedUrl as string || 'https://preview-0ag1onvs.ui.pythagora.ai';

    const isCorrectUrl = currentUrl === expectedUrl;

    console.log(`[URL Verify] Current: ${currentUrl}, Expected: ${expectedUrl}, Match: ${isCorrectUrl}`);

    res.status(200).json({
      isCorrectUrl,
      currentUrl,
      expectedUrl,
      message: isCorrectUrl
        ? 'Application is accessible from the correct URL'
        : `Application is accessible from ${currentUrl} but expected ${expectedUrl}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[URL Verify] Error:', error);
    res.status(500).json({
      error: 'Failed to verify URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Description: Get recommended permanent URL for this deployment
// Endpoint: GET /api/permanent-url
// Request: {}
// Response: { permanentUrl: string, documentation: string, lastChecked: string }
router.get('/permanent-url', (req: Request, res: Response) => {
  try {
    console.log('[Permanent URL] Fetching permanent URL information');

    const currentUrl = getPublicUrl(req);

    const response = {
      permanentUrl: currentUrl,
      apiEndpoints: {
        health: `${currentUrl}/api/health`,
        search: `${currentUrl}/api/search`,
        urlInfo: `${currentUrl}/api/url-info`,
      },
      documentation: 'See PERMANENT_URL.md for full documentation',
      lastChecked: new Date().toISOString(),
      note: 'Bookmark this URL for reliable access to your application',
    };

    console.log('[Permanent URL] Successfully retrieved:', response.permanentUrl);
    res.status(200).json(response);
  } catch (error) {
    console.error('[Permanent URL] Error:', error);
    res.status(500).json({
      error: 'Failed to retrieve permanent URL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
