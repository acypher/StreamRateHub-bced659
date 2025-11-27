import express, { Request, Response } from 'express';

const router = express.Router();

// Description: Get current deployment URL information
// Endpoint: GET /api/url-info
// Request: {}
// Response: { currentUrl: string, environment: string, timestamp: string, isHealthy: boolean }
router.get('/url-info', (req: Request, res: Response) => {
  try {
    console.log('[URL Info] Fetching deployment URL information');

    const protocol = req.protocol;
    const host = req.get('host');
    const currentUrl = `${protocol}://${host}`;
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
    const protocol = req.protocol;
    const host = req.get('host');
    const currentUrl = `${protocol}://${host}`;
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

    const protocol = req.protocol;
    const host = req.get('host');
    const currentUrl = `${protocol}://${host}`;

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
