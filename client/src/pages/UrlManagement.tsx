import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UrlInfo } from '@/components/UrlInfo';
import { AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UrlManagement() {
  const navigate = useNavigate();
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-8">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            URL Management
          </h1>
          <p className="text-muted-foreground">
            Access your permanent URL and troubleshoot connection issues
          </p>
        </div>

        {/* Main URL Info Card */}
        <UrlInfo />

        {/* Why This Matters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Why Your Permanent URL Matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Your application is hosted on Pythagora's cloud infrastructure. The URL shown above
              is your <strong>permanent, stable access point</strong> to CineCite.
            </p>
            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
              <p>✅ This URL will not change or expire</p>
              <p>✅ You can bookmark it for easy access</p>
              <p>✅ You can share it with others</p>
              <p>✅ All API endpoints are accessible through this URL</p>
            </div>
          </CardContent>
        </Card>

        {/* URL Redirect Issue Explanation */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Understanding URL Redirects</AlertTitle>
          <AlertDescription className="space-y-2 text-sm mt-2">
            <p>
              If you're experiencing redirects to <code className="text-xs bg-secondary px-1 rounded">pythagora.ai</code>,
              this typically means:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>You're using an old or expired preview URL</li>
              <li>The deployment was updated with a new URL</li>
              <li>The URL you bookmarked is no longer active</li>
            </ul>
            <p className="font-semibold mt-2">
              ✨ Solution: Always use the URL displayed above for reliable access.
            </p>
          </AlertDescription>
        </Alert>

        {/* Troubleshooting Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Troubleshooting
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              >
                {showTroubleshooting ? 'Hide' : 'Show'}
              </Button>
            </CardTitle>
          </CardHeader>
          {showTroubleshooting && (
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Problem: URL keeps redirecting</h4>
                  <p className="text-muted-foreground">
                    Make sure you're using the current URL displayed above. Clear your browser
                    cache and bookmarks if you have an old URL saved.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Problem: Application won't load</h4>
                  <p className="text-muted-foreground">
                    Check your internet connection and try refreshing the page. If the problem
                    persists, the application might be temporarily down for maintenance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Problem: API requests failing</h4>
                  <p className="text-muted-foreground">
                    Verify that the API endpoints shown above are accessible. Check the browser
                    console for CORS or network errors.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Need more help?</h4>
                  <p className="text-muted-foreground">
                    Check the documentation files in your project:
                    <code className="block mt-1 text-xs bg-secondary p-2 rounded">
                      PERMANENT_URL.md, URL_QUICK_START.md, DEPLOYMENT.md
                    </code>
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('/api/health', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test API Health Endpoint
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Alert className="bg-green-500/10 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700 dark:text-green-400">
            Your Application is Running
          </AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-300">
            You're currently accessing the application successfully. The URL displayed above is
            your permanent link to CineCite.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
