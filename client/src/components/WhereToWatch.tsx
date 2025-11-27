import { Tv } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StreamingPlatform } from '@/api/search';

interface WhereToWatchProps {
  platforms?: StreamingPlatform[];
}

export function WhereToWatch({ platforms }: WhereToWatchProps) {
  console.log('[WhereToWatch] Rendering with platforms:', platforms?.length || 0);

  // If no platforms available, don't render the component
  if (!platforms || platforms.length === 0) {
    console.log('[WhereToWatch] No streaming platforms available');
    return null;
  }

  return (
    <Card className="overflow-hidden border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Tv className="h-6 w-6" />
          <CardTitle className="text-2xl font-bold">Where to Watch</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {platforms.map((platform, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {platform.name}
                </span>
              </div>
              {platform.cost && (
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">
                  {platform.cost}
                </span>
              )}
            </li>
          ))}
        </ul>
        {platforms.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center italic py-4">
            Streaming availability information not available
          </p>
        )}
      </CardContent>
    </Card>
  );
}
