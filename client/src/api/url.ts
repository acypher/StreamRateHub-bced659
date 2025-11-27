import api from './api';

export interface UrlInfo {
  currentUrl: string;
  environment: string;
  timestamp: string;
  isHealthy: boolean;
  deploymentId: string;
  apiBase: string;
}

export interface UrlVerification {
  isCorrectUrl: boolean;
  currentUrl: string;
  expectedUrl: string;
  message: string;
  timestamp: string;
}

export interface PermanentUrlInfo {
  permanentUrl: string;
  apiEndpoints: {
    health: string;
    search: string;
    urlInfo: string;
  };
  documentation: string;
  lastChecked: string;
  note: string;
}

// Description: Get current deployment URL information
// Endpoint: GET /api/url-info
// Request: {}
// Response: { currentUrl: string, environment: string, timestamp: string, isHealthy: boolean, deploymentId: string, apiBase: string }
export const getUrlInfo = async (): Promise<UrlInfo> => {
  try {
    const response = await api.get('/api/url-info');
    return response.data;
  } catch (error) {
    console.error('[URL API] Error fetching URL info:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Verify if the application is accessible from the correct URL
// Endpoint: GET /api/verify-url
// Request: { expectedUrl?: string }
// Response: { isCorrectUrl: boolean, currentUrl: string, expectedUrl: string, message: string, timestamp: string }
export const verifyUrl = async (expectedUrl?: string): Promise<UrlVerification> => {
  try {
    const params = expectedUrl ? { expectedUrl } : {};
    const response = await api.get('/api/verify-url', { params });
    return response.data;
  } catch (error) {
    console.error('[URL API] Error verifying URL:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get recommended permanent URL for this deployment
// Endpoint: GET /api/permanent-url
// Request: {}
// Response: { permanentUrl: string, apiEndpoints: object, documentation: string, lastChecked: string, note: string }
export const getPermanentUrl = async (): Promise<PermanentUrlInfo> => {
  try {
    const response = await api.get('/api/permanent-url');
    return response.data;
  } catch (error) {
    console.error('[URL API] Error fetching permanent URL:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};
