import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPermanentUrl, type PermanentUrlInfo } from '@/api/url';
import { ExternalLink, Copy, CheckCircle2, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export function UrlInfo() {
  const [urlInfo, setUrlInfo] = useState<PermanentUrlInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fetchUrlInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPermanentUrl();
      setUrlInfo(data);
    } catch (err) {
      console.error('Failed to fetch URL info:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch URL information');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch URL information',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUrlInfo();
  }, [fetchUrlInfo]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'URL copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy URL',
      });
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Loading URL Information...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUrlInfo}
            className="ml-2"
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!urlInfo) {
    return null;
  }

  return (
    <Card className="w-full border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Your Permanent URL
        </CardTitle>
        <CardDescription>
          Bookmark this URL for reliable access to CineCite
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main URL Display */}
        <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Badge variant="default" className="shrink-0">
            Active
          </Badge>
          <code className="flex-1 text-sm font-mono break-all">
            {urlInfo.permanentUrl}
          </code>
          <div className="flex gap-1 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(urlInfo.permanentUrl)}
              title="Copy URL"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openInNewTab(urlInfo.permanentUrl)}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Important Note */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>💡 Important:</strong> {urlInfo.note}
          </AlertDescription>
        </Alert>

        {/* API Endpoints */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">API Endpoints:</h4>
          <div className="space-y-1 text-sm">
            {Object.entries(urlInfo.apiEndpoints).map(([name, url]) => (
              <div
                key={name}
                className="flex items-center gap-2 p-2 bg-secondary/20 rounded hover:bg-secondary/30 transition-colors"
              >
                <Badge variant="secondary" className="capitalize text-xs">
                  {name}
                </Badge>
                <code className="flex-1 text-xs font-mono break-all">
                  {url}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(url)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Link */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            📚 {urlInfo.documentation}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last checked: {new Date(urlInfo.lastChecked).toLocaleString()}
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUrlInfo}
          className="w-full"
        >
          Refresh URL Information
        </Button>
      </CardContent>
    </Card>
  );
}
